import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';
import { ModalComponent } from './modal.component';
import { TemplateNameDirective } from './template-name.directive';
import { AutocompleteComponent } from './autocomplete.component';
import { NgModelChangeDebouncedDirective } from './model-change.directive';
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
