import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ngx-drag-drop';
import { TemplateNameModule } from '../template-name/template-name.module';
import { ClassEditorComponent } from './class-editor.component';
import { ConfiguratorComponent } from './configurator.component';
import { PaletteComponent } from './palette.component';

@NgModule({
  imports: [CommonModule, FormsModule, TemplateNameModule, DndModule],
  declarations: [
    ConfiguratorComponent,
    ClassEditorComponent,
    PaletteComponent,
  ],
  exports: [
    TemplateNameModule,
    ConfiguratorComponent,
    PaletteComponent,
  ],
})
export class ConfiguratorModule {}
