import { Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import {ConfigurableDirective} from './configurable.directive';

export interface Configurable {
  id: string;
  parentId: string;
  zone: string;
  enableContainers?: boolean;
  templates?: Record<string, TemplateRef<any>>;
  data?: any;
  dataIndex?: number;
  removeEdited: () => void;
  removeSelected: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfigurableService {
  private _hoveredId?: string;

  // currently edited element'id
  private edited$ = new Subject<Configurable|undefined>();
  
  // previous edited element
  previousConfigurableElement?: Configurable;
  
  // configurable service must subscribe to store'changes events (config service)
  configurableDirectiveMap: Map<string, ConfigurableDirective> = new Map<string, ConfigurableDirective>();

  set hoveredId(id: string | undefined) {
    this._hoveredId = id;
  }
  get hoveredId(): string | undefined {
    return this._hoveredId;
  }

  mouseoverConfigurable(configurable: Configurable) {
    if (this._hoveredId === undefined) {
      this._hoveredId = configurable.id;
    }
  }

  mouseenterConfigurable(configurable: Configurable) {
    if (configurable.id !== this.hoveredId) {
      this._hoveredId = configurable.id;
    }
  }

  mouseleaveConfigurable(configurable: Configurable) {
    this._hoveredId = undefined;
  }

  clickConfigurable(configurable: Configurable) {
    if (!this.previousConfigurableElement) {
      // previous is undefined
      this.previousConfigurableElement = configurable;
    }
    else if (this.previousConfigurableElement.id !== configurable.id
      || (this.previousConfigurableElement.id === configurable.id && this.previousConfigurableElement.zone !== configurable.zone)) {
      // previous exist and it's id don't match with the new configurable element
            
      this.previousConfigurableElement.removeEdited();
      this.previousConfigurableElement.removeSelected();
      this.previousConfigurableElement = configurable;
    }
    else if (this.previousConfigurableElement.id === configurable.id && this.previousConfigurableElement.zone === configurable.zone) {
      // same id and same zone
      this.previousConfigurableElement = undefined;
    }
    
    this.edited$.next(configurable);
  }

  stopEditing() {
    this.previousConfigurableElement?.removeEdited();
    this.previousConfigurableElement?.removeSelected();
    this.previousConfigurableElement = undefined;
    this.edited$.next(undefined);
  }

  watchEdited(): Observable<Configurable> {
    return this.edited$.pipe(filter(this.isConfigurable));
  }

  isConfigurable = (configurable: Configurable | undefined): configurable is Configurable => {
    return !!configurable;
  }
}
