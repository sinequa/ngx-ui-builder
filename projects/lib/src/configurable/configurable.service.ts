import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

export interface Configurable {
  id: string;
  zone: string;
  enableContainers?: boolean;
  templates?: Record<string, TemplateRef<any>>;
  data?: any;
  dataIndex?: number;
  removeEdited: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfigurableService {
  private _hoveredId?: string;

  // currently edited element'id
  edited$ = new Subject<Configurable>();
  
  // previous edited element
  previousConfigurableElement?: Configurable;

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
    } else if (this.previousConfigurableElement.id !== configurable.id || (this.previousConfigurableElement.id === configurable.id && this.previousConfigurableElement.zone !== configurable.zone)) {
      // previous exist and it's id don't match with the new configurable element
      this.previousConfigurableElement.removeEdited();
      this.previousConfigurableElement = configurable;
    }else if (this.previousConfigurableElement.id === configurable.id && this.previousConfigurableElement.zone === configurable.zone) {
      // same id and same zone
      this.previousConfigurableElement = undefined;
    }
    
    this.edited$.next(configurable);
  }
}
