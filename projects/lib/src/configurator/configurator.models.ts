import { Configurable } from "../configurable";
import { ComponentConfig } from "../configuration";
import { TemplateNameDirective } from "../utils";

export interface ConfiguratorOptions {
    paletteOptions?: PaletteOptions;
    showFlexEditor?: boolean;
    showHtmlEditor?: boolean;
    showCssClasses?: boolean;
    showConditionalDisplay?: boolean;
    showRemove?: boolean;
    showDuplicate?: boolean;
}
  
export interface PaletteOptions {
    enableSubcontainers?: boolean;
    enableRawHtml?: boolean;
    rawHtmlPlaceholder?: string;
    showStandardPalette?: boolean;
    showExistingPalette?: boolean;
}

export interface ConfiguratorContext {
    /** Object storing the configuration of the component */
    config: ComponentConfig;
    /** Options of the configurators (may change depending on zone) */
    options: ConfiguratorOptions;
    /** Register of all the components configurators  */
    configurators: Record<string, TemplateNameDirective>;
    /** Context of the zone of the edited component */
    context: Configurable;
    /** Callback that the configurator should call to update the configuration */
    configChanged: () => void;
};
  