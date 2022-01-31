import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ngx-drag-drop';
import { iconsLibrary } from '../svg/icons-library';
import { SvgIconsModule } from '../utils/svg-icon/svg-icon.module';
import { UtilsModule } from '../utils/utils.module';
import { ClassEditorComponent } from './class-editor.component';
import { ConfiguratorComponent } from './configurator.component';
import { FlexEditorComponent } from './flex-editor/flex-editor.component';
import { PaletteComponent } from './palette.component';
import { ToolbarComponent } from './toolbar.component';
import { TreeComponent } from './tree/tree.component';

@NgModule({
  imports: [CommonModule, FormsModule, UtilsModule, DndModule, SvgIconsModule.forRoot(({icons: iconsLibrary}))
  ],
  declarations: [
    ConfiguratorComponent,
    ClassEditorComponent,
    PaletteComponent,
    ToolbarComponent,
    TreeComponent,
    FlexEditorComponent
  ],
  exports: [
    UtilsModule,
    ConfiguratorComponent,
    PaletteComponent,
    ToolbarComponent
  ],
})
export class ConfiguratorModule {}
