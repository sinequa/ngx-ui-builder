import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';
import { ModalComponent } from './modal.component';
import { TemplateNameDirective } from './template-name.directive';
import { AutocompleteComponent } from './autocomplete.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TemplateNameDirective, ModalComponent, TooltipDirective, AutocompleteComponent],
  exports: [TemplateNameDirective, ModalComponent, TooltipDirective, AutocompleteComponent],
})
export class UtilsModule {}
