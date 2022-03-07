import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ngx-drag-drop';
import { iconsLibrary } from '../svg/icons-library';
import { SvgIconsModule } from '../utils/svg-icon/svg-icon.module';
import { UtilsModule } from '../utils/utils.module';
import { ClassEditorComponent, ConditionEditorComponent, FlexEditorComponent, HtmlEditorComponent } from './editors';
import { ConfiguratorComponent } from './configurator.component';
import { PaletteComponent } from './palette/palette.component';
import { ToolbarComponent } from './toolbar.component';
import { TreeComponent } from './tree/tree.component';

@NgModule({
  imports: [CommonModule, FormsModule, UtilsModule, DndModule, SvgIconsModule.forRoot(({icons: iconsLibrary}))
  ],
  declarations: [
    ConfiguratorComponent,
    ClassEditorComponent,
    PaletteComponent,
    HtmlEditorComponent,
    ToolbarComponent,
    TreeComponent,
    FlexEditorComponent,
    ConditionEditorComponent
  ],
  exports: [
    UtilsModule,
    ConfiguratorComponent,
    ToolbarComponent
  ],
})
export class ConfiguratorModule {}
