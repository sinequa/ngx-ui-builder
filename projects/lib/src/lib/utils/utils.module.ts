import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipDirective } from '.';
import { ModalComponent } from './modal.component';
import { TemplateNameDirective } from './template-name.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TemplateNameDirective, ModalComponent, TooltipDirective],
  exports: [TemplateNameDirective, ModalComponent, TooltipDirective],
})
export class UtilsModule {}
