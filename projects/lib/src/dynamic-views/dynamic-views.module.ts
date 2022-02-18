import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurableModule } from '../configurable/configurable.module';
import { UtilsModule } from '../utils/utils.module';
import { DndModule } from 'ngx-drag-drop';

import { ZoneComponent } from './zone.component';
import { ItemComponent } from './item.component';
import {SvgIconsModule} from '../utils/svg-icon/svg-icon.module';
import {iconsLibrary} from '../svg/icons-library';

@NgModule({
  imports: [CommonModule, DndModule, ConfigurableModule, UtilsModule, SvgIconsModule.forRoot(({icons: iconsLibrary}))],
  declarations: [ZoneComponent, ItemComponent],
  exports: [UtilsModule, ZoneComponent],
})
export class DynamicViewsModule {}
