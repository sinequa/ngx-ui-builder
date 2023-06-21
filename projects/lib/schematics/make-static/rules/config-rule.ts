import { Tree, Rule, SchematicsException } from "@angular-devkit/schematics";
import ts, {Expression, factory} from "typescript";
import { MakeStaticOptions } from "../schema";

/**
 * `LiteralValueType` is a type alias that represents the possible types of
 * literal values in TypeScript, such as strings, numbers, and booleans. It is
 * used in the `createProperty` and `createValue` functions to ensure that the
 * correct type of value is created for a given property assignment.
 */
type LiteralValueType = string | number | boolean | [];

let CONFIG_IDENTIFIER = 'GLOBAL_CONFIG';

/**
 * This variable is later used to store
 * the configuration data read from a JSON file and to update an existing
 * TypeScript object literal expression or create a new one.
 */
let configuration = [];

/**
 * This function reads a configuration file and updates a TypeScript source file
 * with a custom transformer or creates a new config object literal if it doesn't
 * exist.
 * @param options - An object containing options for the function, including:
 * @returns A function that takes in an options object and returns a Rule.
 */
export function addConfigObjectRule(options: MakeStaticOptions): Rule {
  return async (tree: Tree) => {

    // exit when 'config-path' or 'config' flag are not provided
    if (!options?.configPath) return;
    if (!options?.config) return;

    CONFIG_IDENTIFIER = options.configIdentifier || CONFIG_IDENTIFIER;

    // first read the configuration json file
    const configFileContent = tree.read(options.config);
    configuration = JSON.parse(configFileContent?.toString() || '');
    if (!Array.isArray(configuration)) {
      throw new SchematicsException(`Expected an array of configuration objects in ${options.config}: ${configuration}`);
    }

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
 * This function updates an existing TypeScript configuration object with
 * additional properties.
 * @param context - The context parameter is an object that provides access to the
 * TypeScript compiler's API, including the factory object used to create new AST
 * nodes. It is used to generate new AST nodes that will be used to update the
 * existing configuration object.
 * @returns The function `updateExistingConfigObject` returns a higher-order
 * function that takes a TypeScript AST node as an argument and returns a
 * transformed version of that node. The transformed node will have additional
 * configuration objects appended to an array literal expression if the parent node
 * is a variable declaration with a specific identifier.
 */
const updateExistingConfigObject = (context) => (root) => {
  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (ts.isVariableDeclaration(node)) {
      if (node.name.getText() === CONFIG_IDENTIFIER && node.type === undefined) {
        return factory.updateVariableDeclaration(node,
          factory.createIdentifier(CONFIG_IDENTIFIER),
          undefined,
          factory.createArrayTypeNode(factory.createTypeReferenceNode(
            factory.createIdentifier("ComponentConfig"),
            undefined
          )),
          factory.createArrayLiteralExpression(
            [...configuration.map(c => ts.factory.createObjectLiteralExpression([
              ...Object.keys(c).map(k => createProperty(k, c[k]))
            ]))],
            false
          )
        )
      }
    }
    if (ts.isArrayLiteralExpression(node)) {
      const { factory } = context;
      const parent: ts.VariableDeclaration = node.parent as ts.VariableDeclaration;
      if (parent.name && parent.name.getText() === CONFIG_IDENTIFIER) {
        return factory.updateArrayLiteralExpression(node, [
          ...node.elements,
          ...configuration.map(c => ts.factory.createObjectLiteralExpression([
            ...Object.keys(c).map(k => createProperty(k, c[k]))
          ])),
        ])
      }
    }
    return ts.visitEachChild(node, visit, context);
  }
  return ts.visitNode(root, visit);
}

/**
 * The function visits each node in a TypeScript AST and checks if it is an array
 * literal expression with a specific identifier.
 * @param node - A TypeScript Node object representing a node in the abstract
 * syntax tree (AST) of a TypeScript program.
 * @param {string} identifier - The identifier parameter is a string that
 * represents the name of a variable that we are searching for in the TypeScript
 * AST (Abstract Syntax Tree).
 * @returns The function does not have a return statement, so it will return
 * `undefined` by default.
 */
function visit(node: ts.Node, identifier: string) {
  if (ts.isVariableDeclaration(node)) {
    if (node.name.getText() === identifier) {
      return true;
    }
  }
  return node.forEachChild((child) => visit(child, identifier));
}


/**
 * This function creates a default configuration object in TypeScript.
 * @returns a TypeScript AST (Abstract Syntax Tree) node that represents a variable
 * statement. Specifically, it is creating a default configuration object by using
 * the `factory` object to create a `VariableStatement` node that exports a `const`
 * variable declaration with an array literal expression containing object literal
 * expressions for each configuration object in the `configuration` array.
 */
function createDefaultConfigObject() {
  return factory.createVariableStatement(
    [factory.createToken(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(
        factory.createIdentifier(CONFIG_IDENTIFIER),
        undefined,
        factory.createArrayTypeNode(factory.createTypeReferenceNode(
          factory.createIdentifier("ComponentConfig"),
          undefined
        )),
        factory.createArrayLiteralExpression(
          [...configuration.map(c => ts.factory.createObjectLiteralExpression([
            ...Object.keys(c).map(k => createProperty(k, c[k]))
          ]))],
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
function createValue(value: LiteralValueType): Expression {
  switch (typeof(value)) {
    case "number":
      return factory.createNumericLiteral(value);
    case "boolean":
      return value ? factory.createTrue() : factory.createFalse()
    case "object":
      if (Array.isArray(value)) {
        return factory.createArrayLiteralExpression([
          ...value.map(v => createValue(v))
        ])
      }
      return factory.createObjectLiteralExpression(
        Object.keys(value).map(k => createProperty(k, value[k]))
      )

    default:
      return factory.createStringLiteral(String(value));
  }
}