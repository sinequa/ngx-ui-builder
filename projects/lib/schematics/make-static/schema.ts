export interface MakeStaticOptions {
  // The path to the config file.
  config: string;

  // If true, will override the source code of the HTML templates rather than generating .static.html files
  override: boolean;

  // If true (and if 'override' is false), update the component .ts files to use the .static.html templates
  updateTemplateUrls: boolean;

  // If true, attempts to comment out the import of the UI Builder stylesheet in the project's stylesheet
  commentScssImport: boolean;

  // Path to a JSON file mapping a module's name to a list of component types (eg. {PokemonModule: ['pokemon-image', 'pokemon-name']})
  appModuleDependencies?: string;

  // The name of the project.
  project?: string;
}
