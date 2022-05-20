import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

const packageJson = {
  peerDependencies: {
    "@ngneat/elf": "^1.0.2",
    "@ngneat/elf-entities": "^3.0.0",
    "@ngneat/elf-state-history": "^1.0.1",
    "@popperjs/core": "^2.11.0",
    "bootstrap": "^5.1.3",
    "ngx-drag-drop": "^2.0.0"
  },
  devDependencies: {
    "@angular/localize": "^12.2.0",
    "@types/bootstrap": "^5.1.6",
    "htmlparser": "1.7.7",
    "html-prettify": "1.0.3",
    "sanitize-html": "2.7.0",
  }
}

// Just return the tree
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {

    // Add peerDependencies to the dependencies of the app
    Object.keys(packageJson.peerDependencies)
      .map(lib => ({
        type: NodeDependencyType.Default,
        name: lib,
        version: packageJson.peerDependencies[lib],
        overwrite: true,
      }))
      .forEach(dep => addPackageJsonDependency(tree, dep));

    // Add devDependency (specifically, bootstrap types)
    Object.keys(packageJson.devDependencies)
      .map(lib => ({
        type: NodeDependencyType.Dev,
        name: lib,
        version: packageJson.devDependencies[lib],
        overwrite: true,
      }))
      .forEach(dep => addPackageJsonDependency(tree, dep));

    // Run npm install
    context.addTask(new NodePackageInstallTask());

    return tree;
  };
}
