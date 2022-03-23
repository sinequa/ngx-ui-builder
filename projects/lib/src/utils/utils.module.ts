import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';
import { ModalComponent } from './modal.component';
import { TemplateNameDirective } from './template-name.directive';
import { NgModelChangeDebouncedDirective } from './model-change.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ModalComponent,
    TemplateNameDirective,
    TooltipDirective,
    NgModelChangeDebouncedDirective,
  ],
  exports: [
    ModalComponent,
    TemplateNameDirective,
    TooltipDirective,
    NgModelChangeDebouncedDirective,
  ],
})
export class UtilsModule {}
