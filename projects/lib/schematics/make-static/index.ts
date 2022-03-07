import {
  Rule, Tree, SchematicsException
} from '@angular-devkit/schematics';

import { normalize, virtualFs, workspaces } from '@angular-devkit/core';
import { MakeStaticOptions } from "./schema";
import { makeStaticHtml } from './html-transformer';

// Entry point of the make-static schematic
export function makeStatic(options: MakeStaticOptions): Rule {
  return async (tree: Tree) => {

    const host = createHost(tree);

    // Read the workspace
    const { workspace } = await workspaces.readWorkspace('/', host);

    // Determine the project if not specified
    if (!options.project && typeof workspace.extensions.defaultProject === 'string') {
      options.project = workspace.extensions.defaultProject;
    }
    
    const project = (options.project != null) ? workspace.projects.get(options.project) : null;
    if (!project) {
      throw new SchematicsException(`Invalid project name: ${options.project}`);
    }

    if(project.extensions.projectType !== 'application') {
      throw new SchematicsException("The make-static schematic must be applied to an application.");
    }
    
    // Reading config file
    const configStr = await host.readFile(options.config);
    const config = JSON.parse(configStr);

    // Inferring the project app folder
    const src = normalize(`${project.sourceRoot}/app`);
    if(!host.isDirectory(src)) {
      throw new SchematicsException(`Directory ${src} does not exist`);
    }

    // Searching for HTML files to transform in the project app
    const htmlTemplates = findHtmlTemplates(tree, src);
    if(htmlTemplates.length === 0) {
      console.warn(`No HTML template could be found under ${src}`);
    }
    
    // Transforming the templates one by one
    for(let path of htmlTemplates) {
      console.log(`Found HTML template ${path}`);
      const html = await host.readFile(path);
      const {staticHtml, modifications} = await makeStaticHtml(html, config);
      if(modifications.length > 0) {
        modifications.forEach(m => console.log(`=> ${m}`));
        if(options.override) {
          tree.overwrite(path, staticHtml);
        }
        else {
          const stPath = `${path.substring(0, path.length-5)}.static.html`; // Rewrite the URL to generate static files
          if(tree.exists(stPath)) {
            tree.overwrite(stPath, staticHtml);
          }
          else {
            tree.create(stPath, staticHtml);
          }
          if(options.updateTemplateUrls) {
            const tsPath = `${path.substring(0, path.length-5)}.ts` // Try to find the controller
            console.log("Attempting to replace templateUrl in the component ", tsPath);
            if(tree.exists(tsPath)) {
              await replaceTemplateUrl(host, tsPath); // Replace the templateUrl to point to the static html file
            }
            else {
              console.warn("=> Could not find the component");
            }
          }
        }
      }
    }

    // Commenting the ngx-ui-builder stylesheet import, if it can be found
    if(options.commentScssImport) {
      const scssPath = normalize(`${project.sourceRoot}/styles/app.scss`);
      if(tree.exists(scssPath)) {
        console.log("Commenting out the UI Builder stylesheet import in the project stylesheet ", scssPath);
        await commmentScssImport(host, scssPath);
      }
      else {
        console.warn("Could not find a stylesheet in the project: ", scssPath);
      }
    }
  }
}

// Walk the tree recursively starting from the given path and add the html files to a list
function findHtmlTemplates(tree: Tree, path: string, list: string[] = []) {
  // console.log(`Looking in directory ${path} from HTML templates...`);
  const dir = tree.getDir(path);
  list.push(...dir.subfiles
    .filter(f => f.endsWith(".html") && !f.endsWith(".static.html"))
    .map(f => normalize(`${path}/${f}`))
  );
  dir.subdirs.forEach(d => findHtmlTemplates(tree, `${path}/${d}`, list));
  return list;
}

async function replaceTemplateUrl(host: workspaces.WorkspaceHost, tsPath: string) {
  const ts = await host.readFile(tsPath);
  const templateUrlPattern = /(["']?\btemplateUrl\b["']?\s*:\s*["'].*?)(\.static)?(\.html["'])/;
  const lines = ts.split('\n');
  const res = replacePatternUnlessDone(lines, templateUrlPattern, 2, "$1.static$3");
  switch(res){
    case 'replaced':
      host.writeFile(tsPath, lines.join('\n'));
      console.log("=> Replaced templateUrl with static template");
      break;
    case 'not-found':
      console.warn("=> Could not find the templateUrl declaration");
      break;
    case 'found':
      console.log("=> templateUrl already points to static template");
      break;
  }
}

async function commmentScssImport(host: workspaces.WorkspaceHost, scssPath: string) {
  const scss = await host.readFile(scssPath);
  const scssImportPattern = /(\/\/\s?)?(@import\s+["']~ngx-ui-builder\/styles\/ui-builder["'])/;
  const lines = scss.split('\n');
  const res = replacePatternUnlessDone(lines, scssImportPattern, 1, '// $2');
  switch(res){
    case 'replaced':
      host.writeFile(scssPath, lines.join('\n'));
      console.log("=> Commented UI Builder SCSS import");
      break;
    case 'not-found':
      console.warn("=> Could not find the UI Builder SCSS import");
      break;
    case 'found':
      console.log("=> The stylesheet is already commented out");
      break;
  }
}

function replacePatternUnlessDone(lines: string[], pattern: RegExp, foundGroup: number, replacement: string): 'not-found'|'found'|'replaced' {
  let state: 'not-found'|'found'|'replaced' = 'not-found';
  for(let i=0; i<lines.length; i++) {
    const match = lines[i].match(pattern);
    if(match) {
      if(match[foundGroup]) {
        state = 'found'
      }
      else {
        lines[i] = lines[i].replace(pattern, replacement);
        state = 'replaced';
      }
      break;
    }
  }
  return state;
}

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException(`File not found: ${path}`);
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}
