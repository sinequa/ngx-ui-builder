import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipDirective } from './directive/tooltip.directive';
import { ModalComponent } from './modal/modal.component';
import { TemplateNameDirective } from './directive/template-name.directive';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { NgModelChangeDebouncedDirective } from './directive/model-change.directive';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ModalComponent,
    TemplateNameDirective,
    TooltipDirective,
    NgModelChangeDebouncedDirective,
    ToastComponent,
    AutocompleteComponent
  ],
  exports: [
    ModalComponent,
    TemplateNameDirective,
    TooltipDirective,
    NgModelChangeDebouncedDirective,
    ToastComponent,
    AutocompleteComponent
  ],
})
export class UtilsModule {}
