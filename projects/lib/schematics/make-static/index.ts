import {
  Rule, Tree, SchematicsException
} from '@angular-devkit/schematics';

import { normalize, virtualFs, workspaces } from '@angular-devkit/core';
import { MakeStaticOptions } from "./schema";
import { makeStaticHtml } from './html-transformer';
import { createHash } from 'crypto';

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
    if(!Array.isArray(config)) {
      throw new SchematicsException(`Expected an array of configuration objects in ${options.config}: ${config}`);
    }

    // Manage base64 images
    if(options.createBase64Images) {
      const src = normalize(`${project.sourceRoot}/assets`);
      if(!host.isDirectory(src)) {
        console.warn(`Directory ${src} does not exist: could not generate base64 image`);
      }
      else {
        await createBase64Images(config, tree, src);
      }
    }

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

    const usedComponentTypes: string[] = [];

    // Transforming the templates one by one
    for(let path of htmlTemplates) {
      console.log(`Found HTML template ${path}`);
      const html = await host.readFile(path);
      const {staticHtml, modifications, componentTypes} = await makeStaticHtml(html, config);
      usedComponentTypes.push(...componentTypes);
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
            console.log("Attempting to replace templateUrl in the component", tsPath);
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

    if(options.appModuleDependencies) {
      // Reading dependencies file
      const depsStr = await host.readFile(options.appModuleDependencies);
      const deps = JSON.parse(depsStr);

      if(!deps || typeof deps !== 'object' || Array.isArray(deps)) {
        throw new SchematicsException("Expected a JSON file mapping module names to component types (eg. {\"PokemonModule\": [\"pokemon-image\",\"pokemon-name\"]})");
      }

      const appModulePath = normalize(`${project.sourceRoot}/app/app.module.ts`);
      if(tree.exists(appModulePath)) {
        console.log("Removing unused dependencies from app.module.ts:", appModulePath);
        await optimizeAppModule(host, appModulePath, deps, usedComponentTypes);
      }
      else {
        console.warn("Could not find an app.module.ts file in the project:", appModulePath);
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
        console.warn("Could not find a stylesheet in the project:", scssPath);
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
  const scssImportPattern = /(\/\/\s?)?(@import\s+["']~@sinequa\/ngx-ui-builder\/styles\/ui-builder["'])/;
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

async function optimizeAppModule(host: workspaces.WorkspaceHost, appModulePath: string, deps: {[moduleName: string]: string[]}, usedComponentTypes: string[]) {
  const appModule = await host.readFile(appModulePath);
  const lines = appModule.split('\n');

  let replacement = false;
  Object.keys(deps).forEach(moduleName => {
    const types = deps[moduleName];
    if(!types || !Array.isArray(types)) {
      console.error(`Expected a list of component type names for ${moduleName}: ${types}`);
      return;
    }

    const isModuleUsed = !!types.find(type => usedComponentTypes.includes(type));
    console.log(isModuleUsed? "Adding module" : "Removing unused module:", moduleName);

    const importPattern = new RegExp(`(\\/\\/\\s?)?(.*\\b${moduleName}\\b.*)`);
    const res = replacePatternUnlessDone(lines, importPattern, isModuleUsed? 3 : 1, isModuleUsed? '$2' : '// $2', false);
    switch(res){
      case 'replaced':
        replacement = true;
        console.log(`=> ${isModuleUsed? "Removed" : "Added"} comment successfully`);
        break;
      case 'not-found':
        console.warn("=> Could not find the import");
        break;
      case 'found':
        console.log(`=> The module is already ${isModuleUsed? 'active' : 'commented out'}`);
        break;
    }
  });

  if(replacement) {
    host.writeFile(appModulePath, lines.join('\n'));
  }
}

function replacePatternUnlessDone(lines: string[], pattern: RegExp, foundGroup: number, replacement: string, firstOnly = true): 'not-found'|'found'|'replaced' {
  let state: 'not-found'|'found'|'replaced' = 'not-found';
  for(let i=0; i<lines.length; i++) {
    const match = lines[i].match(pattern);
    if(match) {
      if(match[foundGroup]) { // Do nothing if we already find a certain pattern
        if(state !== 'replaced') {
          state = 'found';
        }
      }
      else {
        lines[i] = lines[i].replace(pattern, replacement);
        state = 'replaced';
      }
      if(firstOnly) {
        break;
      }
    }
  }
  return state;
}

async function createBase64Images(config: any, tree: Tree, assets: string) {
  if(Array.isArray(config)) {
    for(let item of config) {
      createBase64Images(item, tree, assets);
    }
  }
  else if(typeof config === 'object') {
    for(let [key,val] of Object.entries(config)) {
      if(typeof val === 'object') {
        createBase64Images(val, tree, assets); // recursively go through objects and arrays
      }
      else if(typeof val === 'string') {
        const match = val.match(/^data:image\/([^;]+);base64,(.+)$/i);
        if(match) {
          const ext = match[1];
          const data = Buffer.from(match[2], 'base64');
          const hash = createHash('md5').update(data).digest('hex');
          const filename = `${hash}.${ext}`;
          const path = normalize(`${assets}/${filename}`);
          console.log(`==> Writing image ${path} and updating prop ${key} in the configuration`);
          config[key] = `assets/${filename}`;
          if(!tree.exists(path)) {
            tree.create(path, data);
          }
        }
      }
    }
  }
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
