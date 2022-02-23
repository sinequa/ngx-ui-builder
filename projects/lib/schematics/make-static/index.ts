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
    const src = `${project.sourceRoot}/app`;
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
      const {staticHtml, modified} = await makeStaticHtml(html, config);
      if(modified) {
        console.log("=> Making the template static");
        tree.overwrite(path, staticHtml);
      }
    }
  }
}

// Walk the tree recursively starting from the given path and add the html files to a list
function findHtmlTemplates(tree: Tree, path: string, list: string[] = []) {
  // console.log(`Looking in directory ${path} from HTML templates...`);
  const dir = tree.getDir(path);
  list.push(...dir.subfiles
    .filter(f => f.endsWith(".html"))
    .map(f => normalize(`${path}/${f}`))
  );
  dir.subdirs.forEach(d => findHtmlTemplates(tree, `${path}/${d}`, list));
  return list;
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
