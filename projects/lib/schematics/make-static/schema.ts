export interface MakeStaticOptions {
  /**
   * The path to the json config file.
   */
  config: string;

  /**
   * The path to the ts configuration file (usually config.ts).
   *
   * @example
   * --config-path=path/to/file/config.ts
   */
  configPath: string;

  /**
   * The configuration identifier to use (e.g: CONFIG)
   *
   * @example
   * --config-identifier=CONFIG
   *
   * // This will produce this typescript code
   * export const CONFIG = {};
   */
  configIdentifier: string;

  /**
   * If true, will override the source code of the HTML templates rather than generating .static.html files
   */
  override: boolean;

  /**
   * If true (and if 'override' is false), update the component .ts files to use the .static.html templates
   */
  updateTemplateUrls: boolean;

  /**
   * If true, attempts to comment out the import of the UI Builder stylesheet in the project's stylesheet
   */
  commentScssImport: boolean;

  /**
   * Path to a JSON file mapping a module's name to a list of component types (eg. {PokemonModule: ['pokemon-image', 'pokemon-name']})
   */
  appModuleDependencies?: string;

  /**
   * Detect when the configuration contains images encoded as base64 strings and transform them as files in the assets folder
   */
  createBase64Images: boolean;

  /**
   * The name of the project.
   */
  project?: string;
}
