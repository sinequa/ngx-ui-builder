import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

export interface Configurable {
  id: string;
  zone: string;
  enableContainers?: boolean;
  templates?: Record<string, TemplateRef<any>>;
}

@Injectable({ providedIn: 'root' })
export class ConfigurableService {
  private _hoveredId?: string;

  // currently edited element'id
  edited$ = new Subject<Configurable>();

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
    this.edited$.next(configurable);
  }
}
