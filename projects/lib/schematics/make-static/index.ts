import {
  Rule, Tree, SchematicContext, chain
} from '@angular-devkit/schematics';

import { MakeStaticOptions } from "./schema";
import { updateHTML } from './rules/template-rule';
import { addConfigObjectRule } from './rules/config-rule';

// Entry point of the make-static schematic
export function makeStatic(options: MakeStaticOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rule = chain([
      updateHTML(options),
      addConfigObjectRule(options)
    ])
    return rule(tree, context);
  }
}
