import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

const packageJson = {
  peerDependencies: {
    "@ngrx/store": "^15.0.0",
    "@popperjs/core": "^2.11.5",
    "bootstrap": "^5.2.0",
    "immer": "^9.0.16",
    "ngrx-wieder": "^10.0.2",
    "ngx-drag-drop": "^2.0.0"
  },
  devDependencies: {
    "@angular/localize": "^15.0.0",
    "@types/bootstrap": "^5.2.0",
    "htmlparser": "1.7.7",
    "html-prettify": "1.0.7",
    "sanitize-html": "2.7.1",
  }
}

function addImportsToStyles(host: Tree) {
  const stylesPath = 'src/styles.scss';
  const importsToAdd = `
/* bootstrap's utilities only */
@import "bootstrap/scss/mixins/banner";
@include bsBanner(Utilities);
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/utilities";
@import "bootstrap/scss/root";
@import "bootstrap/scss/helpers";
@import "bootstrap/scss/utilities/api";

@import "../node_modules/@gsaas/ngx-ui-builder/styles/ui-builder.scss";
`;

  if (host.exists(stylesPath)) {
    const originalContent = host.read(stylesPath)!.toString('utf-8');
    const updatedContent = importsToAdd + '\n' + originalContent;
    host.overwrite(stylesPath, updatedContent);
  } else {
    host.create(stylesPath, importsToAdd);
  }
}

// Just return the tree
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    addImportsToStyles(tree);

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
