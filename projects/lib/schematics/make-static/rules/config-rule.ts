import { Tree, Rule, SchematicsException } from "@angular-devkit/schematics";
import ts, {factory} from "typescript";
import { MakeStaticOptions } from "../schema";

/**
 * `LiteralValueType` is a type alias that represents the possible types of
 * literal values in TypeScript, such as strings, numbers, and booleans. It is
 * used in the `createProperty` and `createValue` functions to ensure that the
 * correct type of value is created for a given property assignment.
 */
type LiteralValueType = string | number | boolean;

let CONFIG_IDENTIFIER = 'GLOBAL_CONFIG';

/**
 * This variable is later used to store
 * the configuration data read from a JSON file and to update an existing
 * TypeScript object literal expression or create a new one.
 */
let configuration = {};

/**
 * This function reads a configuration file and updates a TypeScript source file
 * with a custom transformer or creates a new config object literal if it doesn't
 * exist.
 * @param options - An object containing options for the function, including:
 * @returns A function that takes in an options object and returns a Rule.
 */
export function addConfigObjectRule(options: MakeStaticOptions): Rule {
  return async (tree: Tree) => {

    // exit when 'config-flag' is not provided
    if (!options?.configPath) return;

    CONFIG_IDENTIFIER = options.configIdentifier || CONFIG_IDENTIFIER;

    // first read the configuration json file
    const configFileContent = tree.read(options.config);
    configuration = JSON.parse(configFileContent?.toString() || '');
    if (!Array.isArray(configuration)) {
      throw new SchematicsException(`Expected an array of configuration objects in ${options.config}: ${configuration}`);
    }
    // keep only 'global' object and remove 'id' and 'type' useless
    [configuration] = configuration.filter(c => c.type === "global");

    // create ts source file
    const code = tree.read(options.configPath)?.toString("utf-8");
    const sourceFile = ts.createSourceFile(options.configPath, code || "", ts.ScriptTarget.Latest, true)

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    let content: string;

    // first check if config exists
    let found = visit(sourceFile, CONFIG_IDENTIFIER);
    if (found) {
      // transform ts file with custom transformer
      const transformedSourceFile = ts.transform(sourceFile, [updateExistingConfigObject]).transformed[0];
      content = printer.printFile(transformedSourceFile);

    } else {
      const c = createDefaultConfigObject();
      content = printer.printFile(sourceFile);
      content +=printer.printNode(ts.EmitHint.Unspecified, c, sourceFile);
    }
    tree.overwrite(options.configPath, content);
  };
}


/**
 * This function updates an existing TypeScript object literal expression with new
 * properties.
 * @param context - The context parameter is an object that provides access to the
 * TypeScript compiler's API, including the factory for creating new AST nodes and
 * other utilities. It is used in the function to update an existing object literal
 * expression in the AST.
 * @returns The function `updateExistingConfigObject` returns a new function that
 * takes a TypeScript AST node as an argument and returns a modified version of
 * that node. The modified version updates an existing object literal expression by
 * adding properties from a `configuration` object.
 */
const updateExistingConfigObject = (context) => (root) => {
  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (ts.isObjectLiteralExpression(node)) {
      const { factory } = context;
      const parent: ts.VariableDeclaration = node.parent as ts.VariableDeclaration;
      if (parent.name && parent.name.getText() === CONFIG_IDENTIFIER) {
        return factory.updateObjectLiteralExpression(node, [
          ...node.properties,
          ...Object.keys(configuration).map(k => createProperty(k, configuration[k]))
        ])
      }
    }
    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(root, visit);
}

/**
 * The function recursively visits nodes in a TypeScript AST and checks if a given
 * identifier is present in an object literal expression.
 * @param node - A TypeScript AST node that represents a part of a TypeScript
 * source code file.
 * @param {string} identifier - The identifier parameter is a string that
 * represents the name of a variable declaration that we are searching for in the
 * AST (Abstract Syntax Tree).
 * @returns The function is not returning anything explicitly in all cases. If the
 * condition `parent.name && parent.name.getText() === identifier` is true, then
 * the function returns `true`. Otherwise, the function is recursively calling
 * itself on each child node of the input `node`. The function does not return
 * anything in this case, but it could potentially return `undefined` if none of
 * the child nodes match the condition
 */
function visit(node: ts.Node, identifier: string) {
  if (ts.isObjectLiteralExpression(node)) {
    const parent: ts.VariableDeclaration = node.parent as ts.VariableDeclaration;
    if (parent.name && parent.name.getText() === identifier) {
      return true;
    }
  }
  return node.forEachChild((child) => visit(child, identifier));
}

/**
 * This function creates a default configuration object using TypeScript syntax.
 * @returns a TypeScript AST (Abstract Syntax Tree) node that represents a variable
 * statement for exporting a constant variable declaration with an empty object
 * literal as its value.
 */
function createDefaultConfigObject() {
  return factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(
        factory.createIdentifier(CONFIG_IDENTIFIER),
        undefined,
        undefined,
        factory.createObjectLiteralExpression(
          [],
          false
        )
      )],
      ts.NodeFlags.Const
    )
  )
}

/**
 * The function creates a property assignment with a given identifier and value.
 * @param {string} identifier - A string representing the name of the property to
 * be created.
 * @param {LiteralValueType} value - LiteralValueType is a type that represents a
 * literal value in TypeScript, such as a string, number, boolean, null, or
 * undefined. The `value` parameter in the `createProperty` function is expected to
 * be a value of this type.
 * @returns The function `createProperty` is returning a property assignment node
 * created using the TypeScript factory function
 * `factory.createPropertyAssignment`. The property assignment node consists of an
 * identifier node created using `factory.createIdentifier` and a value node
 * created using the `createValue` function.
 */
function createProperty(identifier: string, value: LiteralValueType) {
  return factory.createPropertyAssignment(
    factory.createIdentifier(identifier),
    createValue(value)
  )
}
/**
 * The function creates a TypeScript value based on the type of the input value.
 * @param {LiteralValueType} value - The value parameter is of type
 * LiteralValueType, which means it can be a number, boolean, string, null, or
 * undefined.
 * @returns The function `createValue` takes in a parameter `value` of type
 * `LiteralValueType` and returns a TypeScript AST node based on the type of the
 * input value. If the input value is a number, it returns a numeric literal node
 * using the TypeScript factory method `createNumericLiteral()`. If the input value
 * is a boolean, it returns a boolean literal node using the TypeScript factory
 * method `create
 */
function createValue(value: LiteralValueType ) {
  switch (typeof(value)) {
    case "number":
      return factory.createNumericLiteral(value);
    case "boolean":
      return value ? factory.createTrue() : factory.createFalse()

    default:
      return factory.createStringLiteral(String(value));
      break;
  }
}