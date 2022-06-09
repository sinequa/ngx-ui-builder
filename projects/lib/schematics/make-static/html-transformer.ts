
import * as htmlparser from 'htmlparser';
import * as prettify from 'html-prettify';
import * as sanitizeHtml from 'sanitize-html';
import { SchematicsException } from '@angular-devkit/schematics';

declare interface ComponentConfig extends Record<string,any> {
  readonly id: string;
  type: string;
  items?: string[];
  rawHtml?: string;
  condition?: {data?: string}; // Much simpler interface than Condition for extendibility
}

declare interface HTMLElement {
  name: string;
  type: 'tag' | 'comment' | 'text';
  raw: string;
  attribs: Record<string,string>;
  children?: HTMLElement[];
  $html?: string;
}

export interface HtmlModifications {
  staticHtml: string;
  modifications: string[];
  componentTypes: string[];
}


export async function makeStaticHtml(html: string, config: ComponentConfig[]): Promise<HtmlModifications> {
  return new Promise<HtmlModifications>((resolve, reject) => {
    var handler = new htmlparser.DefaultHandler((error: string, dom: HTMLElement[]) => {
      if (error)
        reject(`Failed to parse the HTML template: ${error}`);
      else
        resolve(processTemplate(dom, config));
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
  });
}

// HTML template processing

function processTemplate(dom: HTMLElement[], config: ComponentConfig[]): HtmlModifications {
  const modifications: string[] = [];
  const componentTypes: string[] = [];

  const zones = getZones(dom);
  for(let zone of zones) {
    const id = zone.attribs['id'];
    if(!id) {
      throw new SchematicsException(`Found uib-zone element with no id`);
    }

    const templates = zone.children?.filter(t => t.type === 'tag' && t.name === 'ng-template');;
    if(!templates?.length) {
      throw new SchematicsException(`No template found in zone ${id}`);
    }

    const conf = config.find(c => c.id === id);
    if(!conf) {
      throw new SchematicsException(`No configuration for zone ${id}`);
    }

    //console.log(`Generating zone ${id}`,zone);

    let dataName = "data";
    // Try to guess the right data name (eg. "record" instead of "data")
    if(templates?.[0]?.attribs) {
      for(const [key, value] of Object.entries(templates[0].attribs)) {
        if(key.startsWith("let-") && value === "data") { // Looking for pattern let-record="data"
          dataName = key.substring(4);
        }
      }
    }

    let innerHtml = generateHtml(conf, templates, config, dataName, zone.attribs['[conditionsData]'], componentTypes);

    const attrs = [] as string[];
    // Manage special attributes of the uib-zone component
    for (const [attr, value] of Object.entries(zone.attribs)) {
      switch(attr) {
        case '[conditionsData]': break; // [conditionsData] input already handled by generateHtml()
        case '[data]': {  // Transform the [data] input into a for loop on the child <div>
          // strong assumption: data has to be an array (even though uib-zone can take non-array data)
          innerHtml = innerHtml.replace("<div", `<div *ngFor="let ${dataName} of ${value}"`);
          break;
        }
        case '(itemClicked)': { // Transform the (itemClicked) event on the zone into a (click) event on the child <div>
          let action = zone.attribs['(itemClicked)']; // eg. onDocumentClicked($event.data, $event.event)
          action = action.replace(/\$event\.data/, dataName);
          action = action.replace(/\$event\.event/, "$event");
          innerHtml = innerHtml.replace("<div", `<div (click)="${action}"`);
          break;
        }
        default: attrs.push(`${attr}="${value}"`); break; // All other attributes are kept as is (incl. "id", "class", "*ngIf"...)
      }
    }

    zone.$html = `<div ${attrs.join(' ')}>\r\n${innerHtml}\r\n</div>`;

    modifications.push(`Made uib-zone '${id}' static`);
  }

  // Remove configurator and toolbar if found
  dom = removeElements(dom, ['uib-toolbar', 'uib-configurator', 'uib-toast'], modifications);

  const staticHtml = modifications.length > 0? prettify(getInnerHtml(dom)) : '';

  return {staticHtml, modifications, componentTypes};
}

// Find uib-zone elements within the template
function getZones(dom: HTMLElement[]): HTMLElement[] {
  let zones: HTMLElement[] = [];
  for(let el of dom) {
    // console.log(el.type, el.name);
    if(el.type === 'tag' && el.name === 'uib-zone') {
      zones.push(el);
    }
    if(el.children?.length) {
      zones.push(...getZones(el.children));
    }
  }
  return zones;
}

// Generate the HTML of a UI Builder component, based on its configuration and templates
function generateHtml(conf: ComponentConfig, templates: HTMLElement[], config: ComponentConfig[], dataName: string, conditionsDataName: string | undefined, componentTypes: string[]): string {
  // Generate attributes
  let classes = conf.classes || '';
  let style = '';
  if(conf.type === '_container') {
    // Necessary to replace the display: flex and min-width: 0 from the .uib-container class
    classes += " d-flex";
    style = 'min-width: 0;'
  }
  let attr = classes? ` class="${classes.trim()}"`: '';
  if(style) {
    attr += ` style="${style}"`;
  }
  if(conf.condition) {
    attr += conditionToNgIf(conf.condition, dataName, conditionsDataName);
  }

  // Generate inner HTML
  let innerHtml = '';
  if(conf.type === '_container') {
    innerHtml = (conf.items as string[])
      .map(c => config.find(cc => cc.id === c))       // For each item, map its config
      .filter(c => c)                                 // Keep the configs that exist
      .map(c => generateHtml(c!, templates, config, dataName, conditionsDataName, componentTypes))  // Generate the HTML for this item
      .join('\r\n');                                  // Join the resulting HTML
  }
  else if(conf.type === '_raw-html') {
    innerHtml = `<div>\r\n${sanitizeHtml(conf.rawHtml || '')}\r\n</div>`;
  }
  else {
    componentTypes.push(conf.type);
    const template = templates.find(t => t.attribs?.['uib-template'] === conf.type);
    if(template) {
      innerHtml = getInnerHtml(template.children, conf);
    }
  }

  return `<div${attr}>\r\n${innerHtml}\r\n</div>`;
}

function conditionToNgIf(condition: {data?: string}, dataName: string, conditionsDataName?: string): string {
  if(condition.data && conditionsDataName) {
    dataName = `(${conditionsDataName})['${condition.data}']`;
  }
  return ` *ngIf="${dataName} | uibCondition:${JSON.stringify(condition).replace(/\"/g, "'")}"`;
}

// Construct a HTML string recursively from a list of elements
function getInnerHtml(elements?: HTMLElement[], config?: ComponentConfig): string {
  let text = "";
  if(elements) {
    for(let el of elements) {
      if(el.$html) {
        text += `${el.$html}\r\n`;
        continue;
      }
      let attribs = el.raw;
      // If a config object is provided, we use it to rewrite the template where it contains references to that config
      if(config) {
        [...attribs.matchAll(/\bconfig\.([\w\.]+)\b/g)]
          .reverse() // Start from the end so that index positions remain valid during the rewrite
          .forEach(match => {
            const expr = match[0];
            const props = match[1].split('.');
            //console.log(expr, prop, config)
            const value = JSON.stringify(getConfigValue(config, props))?.replace(/\"/g, "'");
            if(match.index !== undefined) {
              attribs = attribs.substring(0,match.index) + value + attribs.substring(match.index+ expr.length);
            }
          });
      }
      switch(el.type) {
        case 'text': text += attribs; break;
        case 'comment': text += `<!--${el.raw}-->`; break;
        case 'tag': {
          text += `<${attribs}>${getInnerHtml(el.children, config)}`;
          if(!['input','img','hr'].includes(el.name.toLowerCase())) {
            text += `</${el.name}>`;
          }
          break;
        }
      }
    }
  }
  return text;
}

function getConfigValue(config: ComponentConfig, props: string[]): any {
  let value = config;
  for(let prop of props) {
    value = value?.[prop];
  }
  return value;
}

function removeElements(dom: HTMLElement[], elements: string[], modifications: string[]) {
  dom.forEach(el => {
    if(el.children)
      el.children = removeElements(el.children, elements, modifications);
  });
  const filtered: HTMLElement[] = [];
  dom.forEach(el => {
    if(el.type !== 'tag' || !elements.includes(el.name)) {
      filtered.push(el);
    }
    else {
      modifications.push(`Removed '${el.name}' element`);
    }
  });
  return filtered;
}
