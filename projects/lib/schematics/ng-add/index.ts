import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

const packageJson = {
  peerDependencies: {
    "@ngrx/store": "^14.3.2",
    "@popperjs/core": "^2.11.5",
    "bootstrap": "^5.2.0",
    "immer": "^9.0.16",
    "ngrx-wieder": "^9.0.0",
    "ngx-drag-drop": "^2.0.0"
  },
  devDependencies: {
    "@angular/localize": "^14.1.0",
    "@types/bootstrap": "^5.2.0",
    "htmlparser": "1.7.7",
    "html-prettify": "1.0.7",
    "sanitize-html": "2.7.1",
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
