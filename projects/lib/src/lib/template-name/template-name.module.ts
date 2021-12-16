import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TemplateNameDirective } from './template-name.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TemplateNameDirective],
  exports: [TemplateNameDirective],
})
export class TemplateNameModule {}
