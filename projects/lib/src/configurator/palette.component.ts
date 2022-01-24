import { ChangeDetectionStrategy, Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Configurable } from '../configurable/configurable.service';
import {
  ComponentConfig,
  ContainerConfig,
} from '../configuration/config.service';
import {
  ComponentCreator,
  DragDropService,
} from '../dynamic-views/drag-drop.service';

declare interface PaletteItem extends ComponentCreator {
  type: string;
  display?: string;
  iconClass?: string;
  createConfig: (id: string, creator?: ComponentCreator) => Observable<ComponentConfig|undefined>;
}

declare interface ConfigModal {
  configurator: TemplateRef<any>;
  config: ComponentConfig;
  configChanged: () => void;
  title: string;
  close: Subject<ComponentConfig|undefined>;
}

@Component({
  selector: 'uib-palette',
  templateUrl: './palette.component.html',
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
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaletteComponent implements OnChanges {
  @Input() palette?: PaletteItem[];
  @Input() config: ContainerConfig;
  @Input() context?: Configurable;
  @Input() configurators: Record<string,TemplateRef<any>> = {}; 

  _palette: PaletteItem[];

  modal?: ConfigModal;

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
    if (this.context?.enableContainers) {
      this._palette.push({
        type: 'container',
        display: 'Container',
        createConfig: (id: string) => of({ type: 'container', id, items: [] }),
      });
    }
    if (this.context?.templates) {
      Object.keys(this.context.templates).forEach((type) =>
        this._palette.push({
          type,
          createConfig: (id: string) => this.openModal(id, type, this.configurators[type]),
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

  openModal(id: string, type: string, configurator?: TemplateRef<any>): Observable<ComponentConfig|undefined> {
    const config = {type, id};
    if(configurator) {
      this.modal = {
        configurator,
        config,
        configChanged: () => {}, // do nothing when the configurator changes the config (before user presses 'OK')
        title: `Create new ${type} component`,
        close: new Subject<ComponentConfig|undefined>()
      }
      return this.modal.close;
    }
    return of(config);
  }

  onModalClose(success: boolean) {
    if(this.modal?.close) {
      this.modal.close.next(success? this.modal.config : undefined);
      this.modal.close.complete();
      this.modal = undefined;
    }
  }

}
