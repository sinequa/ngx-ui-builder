import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ComponentConfig,
  ConfigService,
  ContainerConfig,
} from '../configuration/config.service';

export interface ContainerIndex {
  container: string;
  index: number;
}

export interface ComponentCreator {
  type: string;
  createConfig: (id: string, creator?: ComponentCreator) => Observable<ComponentConfig|undefined>;
}

@Injectable({ providedIn: 'root' })
export class DragDropService {
  constructor(public configService: ConfigService) {}

  draggedCreator?: ComponentCreator;

  public handleDrop(
    containerId: string,
    index: number,
    dropped: ContainerIndex | string
  ) {
    const container = this.configService.getContainer(containerId);
    // Drop a component from a container to another container
    if ((dropped as ContainerIndex).container) {
      dropped = dropped as ContainerIndex;
      const og = this.configService.getContainer(dropped.container);
      if (dropped.container === containerId) {
        this.moveWithin(og, dropped.index, index);
      } else {
        this.moveBetween(container, index, og, dropped.index);
      }
    }
    // Drag a component creator (from a palette)
    else if (this.draggedCreator?.type === dropped) {
      const newId = this.configService.generateId(dropped);
      this.draggedCreator
        .createConfig(newId, this.draggedCreator)
        .subscribe((config) => this.insertNew(container, index, config));
    }
    else {
      console.error("Unexpected dropped item:", dropped);
    }
  }

  public handleCancel(
    index: number,
    containerId: string
  ) {
    const container = this.configService.getContainer(containerId);
    container.items.splice(index, 1);
    this.configService.updateConfig([container]);
  }

  private insertNew(
    container: ContainerConfig,
    index: number,
    component: ComponentConfig|undefined
  ) {
    if(component) {
      container.items.splice(index, 0, component.id);
      this.configService.updateConfig([container, component]); // addEntities might be needed
    }
  }

  private moveBetween(
    container: ContainerConfig,
    index: number,
    ogContainer: ContainerConfig,
    ogIndex: number
  ) {
    let item = ogContainer.items.splice(ogIndex, 1);
    container.items.splice(index, 0, item[0]);
    this.configService.updateConfig([ogContainer, container]);
  }

  private moveWithin(
    container: ContainerConfig,
    oldIndex: number,
    newIndex: number
  ) {
    if (oldIndex !== newIndex && oldIndex !== newIndex - 1) {
      let item = container.items.splice(oldIndex, 1);
      if (newIndex > oldIndex) {
        newIndex--;
      }
      container.items.splice(newIndex, 0, item[0]);
      this.configService.updateConfig(container);
    }
  }
}
