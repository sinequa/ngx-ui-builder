import { NgModule } from "@angular/core";

import { AutocompleteComponent, CheckboxComponent, ColorPickerComponent, ConditionPipe, ConfigModule, ConfiguratorComponent, ImageSelectorComponent, ItemComponent, MultiSelectComponent, NgModelChangeDebouncedDirective, PaletteComponent, TemplateNameDirective, ToastComponent, ToolbarComponent, TooltipDirective, ZoneComponent } from "./public-api";


const components = [
  ConfigModule,
  // standalone components
  ConditionPipe,
  ConfiguratorComponent,
  ZoneComponent,
  ItemComponent,
  ToolbarComponent,
  ToastComponent,
  AutocompleteComponent,
  CheckboxComponent,
  ImageSelectorComponent,
  ColorPickerComponent,
  MultiSelectComponent,
  PaletteComponent,
  // directives
  TemplateNameDirective,
  TooltipDirective,
  NgModelChangeDebouncedDirective,
]

@NgModule({
  imports: [...components],
  exports: [...components]
})
export class uibModule {}