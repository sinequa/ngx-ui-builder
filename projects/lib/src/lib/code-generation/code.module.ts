import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeDirective } from './code.directive';
import { CodeEditorComponent } from './code-editor.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [CodeDirective, CodeEditorComponent],
  exports: [CodeDirective, CodeEditorComponent],
})
export class CodeGenerationModule {}
