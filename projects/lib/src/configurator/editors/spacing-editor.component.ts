import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, QueryList, Renderer2, SimpleChanges, ViewChildren } from "@angular/core";
import { ComponentConfig, ConfigService } from "../../configuration";
import { TooltipDirective } from "../../utils";
import { SvgIconComponent } from "../../utils/svg-icon/svg-icon.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'uib-bs-spacing-editor',
  standalone: true,
  imports: [CommonModule, TooltipDirective, SvgIconComponent],
  template: `
  <details id="spacing-options" #details>
    <summary i18n>Spacing and borders</summary>
    <div class="card p-2">
      <details *ngFor="let option of options" [id]="option.name" #details>
        <summary><strong>{{option.title}}</strong></summary>
        <p class="small text-muted m-0">{{option.description}}</p>
        <ng-container *ngFor="let prop of option.properties">
          <div>{{prop.title}}</div>
          <div class="radio-group">
            <ng-container *ngFor="let o of prop.options">
              <input type="radio" id="{{option.name}}-{{prop.name}}-{{o.code}}" [checked]="isChecked(option.name, prop.name, o.code)" (click)="toggle(option.name, prop.name, o.code)"/>
              <label class="p-0" for="{{option.name}}-{{prop.name}}-{{o.code}}" [uib-tooltip]="o.description" placement="bottom">
                <svg-icon [key]="o.icon" width="36px" height="36px"></svg-icon>
              </label>
            </ng-container>
          </div>
        </ng-container>
      </details>
      <a class="small text-muted mt-2" href="https://getbootstrap.com/docs/5.2/utilities/api/" target="_blank" i18n>More utilities from the Bootstrap library</a>
    </div>
  </details>
  `,
  styleUrls: ['./flex-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpacingEditorComponent implements AfterViewInit, OnChanges {
  @Input() config: ComponentConfig;

  @ViewChildren("details") details: QueryList<ElementRef<HTMLDetailsElement>>;

  componentId: string;

  classes: string[];
  state: {[type: string]: {index: number, direction: string|undefined, magnitude: string|undefined}};

  directions = {
    name: "direction" as const,
    title: $localize `Direction`,
    options: [
      {description: $localize `All around`, code: "", icon: "direction-left-right-top-bottom"},
      {description: $localize `On the left side`, code: "s", icon: "direction-left"},
      {description: $localize `On the right side`, code: "e", icon: "direction-right"},
      {description: $localize `On the top side`, code: "t", icon: "direction-top"},
      {description: $localize `On the bottom side`, code: "b", icon: "direction-bottom"},
      {description: $localize `On the left and right`, code: "x", icon: "direction-left-right"},
      {description: $localize `On the top and bottom`, code: "y", icon: "direction-top-bottom"}
    ]
  };

  magnitudes = {
    name: "magnitude" as const,
    title: $localize `Space`,
    options: [
      {description: $localize `None`, code: "0", icon: "no-space"},
      {description: $localize `Extra Small`, code: "1", icon: "space-xs"},
      {description: $localize `Small`, code: "2", icon: "space-s"},
      {description: $localize `Medium`, code: "3", icon: "space-m"},
      {description: $localize `Large`, code: "4", icon: "space-l"},
      {description: $localize `Extra Large`, code: "5", icon: "space-xl"}
    ]
  };

  borderDirections = {
    name: "direction" as const,
    title: $localize `Direction`,
    options: [
      {description: $localize `All around`, code: "", icon: "direction-left-right-top-bottom"},
      {description: $localize `On the left side`, code: "-start", icon: "direction-left"},
      {description: $localize `On the right side`, code: "-end", icon: "direction-right"},
      {description: $localize `On the top side`, code: "-top", icon: "direction-top"},
      {description: $localize `On the bottom side`, code: "-bottom", icon: "direction-bottom"},
    ]
  }

  marginMagnitudes = {
    ...this.magnitudes,
    options: [
      ...this.magnitudes.options,
      {description: $localize `Auto`, code: "auto", icon: "auto"}
    ]
  };

  options = [
    {name: "m", title: $localize `Margin`, description: $localize `Margin is the space around the component`, properties: [this.directions, this.marginMagnitudes]},
    {name: "p", title: $localize `Padding`, description: $localize `Padding is the space within the component`, properties: [this.directions, this.magnitudes]},
    {name: "border", title: $localize `Border`, description: $localize `Border around the component`, properties: [this.borderDirections, this.magnitudes]}
  ];


  constructor(
    public configService: ConfigService,
    public renderer: Renderer2,
    public cdRef: ChangeDetectorRef
  ){}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config) {
      this.updateState();
      if(this.config.id !== this.componentId) {
        this.componentId = this.config.id;
        this.updateDetails(); // Update the <details> when a new component is open
      }
    }
  }

  /**
   * Initialize the state of the <detail> elements upon ViewInit
   * (the first call to updateDetails() from ngOnChanges() does not
   * yet have access to these elements)
   */
  ngAfterViewInit(): void {
    this.updateDetails();
  }

  /**
   * Take the input configuration (config.classes) and parse the content
   * to feed the state object (which determines the state of each option).
   */
  updateState() {
    this.classes = this.config.classes?.split(' ') || [];
    this.state = {};
    for(let index=0; index<this.classes.length; index++) {
      const c = this.classes[index];
      // Extract margin
      let match = c.match(/^m([stebxy]?)-([0-5]|auto)$/);
      if(match) {
        this.state['m'] = {index, direction: match[1], magnitude: match[2]};
      }
      // Extract padding
      match = c.match(/^p([stebxy]?)-([0-5])$/);
      if(match) {
        this.state['p'] = {index, direction: match[1], magnitude: match[2]};
      }
      // Extract "border-1"
      match = c.match(/^border-([0-5])$/);
      if(match) {
        this.state['border-magnitude'] = {index, direction: undefined, magnitude: match[1]};
      }
      // Extract "border-top" or "border"
      for(const direction of this.borderDirections.options.map(o => o.code)) {
        if(c === `border${direction}`) {
          this.state[`border${direction}`] = {index, direction, magnitude: undefined};
        }
      }
    }
  }

  /**
   * This method opens or closes the <detail> elements, depending on the classes
   * contained in the configuration
   */
  updateDetails() {
    if(this.details) {
      const props = Object.keys(this.state);
      for(let detail of this.details) {
        let open: boolean = true;
        switch(detail.nativeElement.id) {
          case "spacing-options": open = props.length > 0; break;
          case "m": open = props.includes('m'); break;
          case "p": open = props.includes('p'); break;
          case "border": open = !!props.find(p => p.startsWith("border")); break;
        }
        if(open) {
          this.renderer.setAttribute(detail.nativeElement, "open", "");
        }
        else {
          this.renderer.removeAttribute(detail.nativeElement, "open")
        }
      }
      this.cdRef.detectChanges();
    }
  }

  /**
   * Returns the activation state of a given property.
   * This function is called by the template to set the "checked" state
   * of each radio button.
   */
  isChecked(type: 'p'|'m'|'border'|string, prop: 'direction'|'magnitude', code: string): boolean {
    if(type === 'border') {
      type = prop === 'magnitude'? `${type}-${prop}` : `${type}${code}`;
    }
    return this.state[type]?.[prop] === code;
  }

  /**
   * Toggles the state of a given property.
   * This function is called by the template upon a click on a radio button.
   */
  toggle(type: 'p'|'m'|'border'|string, prop: 'direction'|'magnitude', code: string) {
    if(type === 'border') {
      type = prop === 'magnitude'? `${type}-${prop}` : `${type}${code}`;
    }
    const match = this.state[type];
    if(match) {
      const currentVal = match[prop];
      if(currentVal === code) {
        this.classes[match.index] = "";
        delete this.state[type];
      }
      else {
        match[prop] = code;
      }
    }
    else {
      this.state[type] = {index: this.classes.length, direction: '', magnitude: '0'};
      this.state[type][prop] = code;
    }

    this.updateClasses();
  }

  /**
   * Update the class list and propagate the update to the config service
   */
  updateClasses() {
    for(const [type,match] of Object.entries(this.state)) {
      if(type.startsWith('border')) {
        this.classes[match.index] = type === 'border-magnitude' ? `border-${match.magnitude}` : `border${match.direction}`;
      }
      else {
        this.classes[match.index] = `${type}${match.direction}-${match.magnitude}`;
      }
    }
    this.config.classes = this.classes.filter(c => c).join(' ');
    this.configService.updateConfig(this.config);
  }

}
