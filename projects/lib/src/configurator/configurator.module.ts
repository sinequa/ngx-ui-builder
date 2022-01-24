import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ngx-drag-drop';
import { UtilsModule } from '../utils/utils.module';
import { ClassEditorComponent } from './class-editor.component';
import { ConfiguratorComponent } from './configurator.component';
import { PaletteComponent } from './palette.component';
import { ToolbarComponent } from './toolbar.component';
import { TreeComponent } from './tree/tree.componant';

@NgModule({
  imports: [CommonModule, FormsModule, UtilsModule, DndModule],
  declarations: [
    ConfiguratorComponent,
    ClassEditorComponent,
    PaletteComponent,
    ToolbarComponent,
    TreeComponent
  ],
  exports: [
    UtilsModule,
    ConfiguratorComponent,
    PaletteComponent,
    ToolbarComponent
  ],
})
export class ConfiguratorModule {}
