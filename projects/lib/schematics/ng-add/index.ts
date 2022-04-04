import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';
import * as packageJson from '../../package.json';


// Just return the tree
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {

    // Add peerDependencies to the dependencies of the app
    Object.keys(packageJson.peerDependencies)
      .filter(lib => !lib.startsWith("@angular"))
      .map(lib => ({
        type: NodeDependencyType.Default,
        name: lib,
        version: packageJson.peerDependencies[lib],
        overwrite: true,
      }))
      .forEach(dep => addPackageJsonDependency(tree, dep));

    // Add devDependency (specifically, bootstrap types)
    Object.keys(packageJson.devDependencies)
      .filter(lib => packageJson.devDependencies[lib].startsWith("@types"))
      .map(lib => ({
        type: NodeDependencyType.Dev,
        name: lib,
        version: packageJson.peerDependencies[lib],
        overwrite: true,
      }))
      .forEach(dep => addPackageJsonDependency(tree, dep));

    // Run npm install
    context.addTask(new NodePackageInstallTask());
    
    return tree;
  };
}
