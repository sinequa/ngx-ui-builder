import { Component, Input, OnChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Configurable } from '../configurable/configurable.service';
import {
  ComponentConfig,
  ContainerConfig,
} from '../configuration/config.service';
import {
  ComponentCreator,
  DragDropService,
} from '../dynamic-views/drag-drop.service';

export interface PaletteItem extends ComponentCreator {
  type: string;
  display?: string;
  iconClass?: string;
  createConfig: (
    id: string,
    creator?: ComponentCreator
  ) => Observable<ComponentConfig>;
}

@Component({
  selector: 'uib-palette',
  template: `
Component palette (drag & drop):
<div>
  <div *ngFor="let item of _palette"
    [dndDraggable]="item.type"
    [dndEffectAllowed]="'copy'"
    (dndStart)="onDndStart(item)"
    (dndEnd)="onDndEnd()"
    class="palette-item">
    <span [ngClass]="item.iconClass"></span>
    {{item.display || item.type}}
  </div>
</div>
  `,
  styles: [
    `
.palette-item {
  display: inline-block;
  border: 1px solid grey;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  background: rgb(0,0,0,0.1);
  cursor: pointer;
  margin-right: 5px;
}
  `,
  ],
})
export class PaletteComponent implements OnChanges {
  @Input() palette?: PaletteItem[];
  @Input() config: ContainerConfig;
  @Input() context: Configurable;

  _palette: PaletteItem[];

  constructor(public dragDropService: DragDropService) {}

  ngOnChanges() {
    if (this.palette) {
      this._palette = this.palette;
    } else {
      this.generateAutoPalette();
    }
  }

  generateAutoPalette() {
    this._palette = [];
    if (this.context.enableContainers) {
      this._palette.push({
        type: 'container',
        display: 'Container',
        createConfig: (id: string) => of({ type: 'container', id }),
      });
    }
    if (this.context.templates) {
      Object.keys(this.context.templates).forEach((type) =>
        this._palette.push({
          type,
          createConfig: (id: string) => of({ type, id }),
        })
      );
    }
  }

  onDndStart(item: PaletteItem) {
    this.dragDropService.draggedCreator = item;
  }

  onDndEnd() {
    this.dragDropService.draggedCreator = undefined;
  }
}
