import { AfterViewInit, Component, ElementRef, Input, OnChanges, TemplateRef, ViewChild } from '@angular/core';
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
import { Modal } from 'bootstrap';

declare interface PaletteItem extends ComponentCreator {
  type: string;
  display?: string;
  iconClass?: string;
  createConfig: (id: string, creator?: ComponentCreator) => Observable<ComponentConfig|undefined>;
}

declare interface ConfigModal {
  modal: Modal;
  configurator: TemplateRef<any>;
  config: ComponentConfig;
  configChanged: () => void;
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
  `,
  ],
})
export class PaletteComponent implements OnChanges, AfterViewInit {
  @Input() palette?: PaletteItem[];
  @Input() config: ContainerConfig;
  @Input() context?: Configurable;
  @Input() configurators: Record<string,TemplateRef<any>> = {}; 

  @ViewChild('configModal') configModal: ElementRef;

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

  ngAfterViewInit() {
    this.configModal.nativeElement.addEventListener('hidden.bs.modal', event => this.onModalClose(false)); 
  }

  generateAutoPalette() {
    this._palette = [];
    if (this.context?.enableContainers) {
      this._palette.push({
        type: 'container',
        display: 'Container',
        createConfig: (id: string) => of({ type: 'container', id }),
      });
    }
    if (this.context?.templates) {
      Object.keys(this.context.templates).forEach((type) =>
        this._palette.push({
          type,
          createConfig: (id: string) => this.createConfig(id, type),
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

  createConfig(id: string, type: string, configurator?: TemplateRef<any>): Observable<ComponentConfig|undefined> {
    if(this.configurators[type]) {
      this.modal = {
        configurator: this.configurators[type],
        modal: Modal.getOrCreateInstance(this.configModal.nativeElement, {}),
        config: {type, id},
        close: new Subject<ComponentConfig|undefined>(),
        configChanged: () => {}
      }
      this.modal.modal.show();
      return this.modal.close;
    }
    return of({ type, id });
  }

  onModalClose(success: boolean) {
    if(this.modal?.close) {
      this.modal.close.next(success? this.modal.config : undefined);
      this.modal.close.complete();
      this.modal.modal.hide();
      this.modal = undefined;
    }
  }

}
