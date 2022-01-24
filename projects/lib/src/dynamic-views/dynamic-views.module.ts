import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurableModule } from '../configurable/configurable.module';
import { UtilsModule } from '../utils/utils.module';
import { DndModule } from 'ngx-drag-drop';

import { ZoneComponent } from './zone.component';
import { ItemComponent } from './item.component';
import { CodeGenerationModule } from '../code-generation/code.module';

@NgModule({
  imports: [CommonModule, DndModule, ConfigurableModule, UtilsModule, CodeGenerationModule],
  declarations: [ZoneComponent, ItemComponent],
  exports: [UtilsModule, ZoneComponent],
})
export class DynamicViewsModule {}
