import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TemplateNameDirective } from '../utils/directive/template-name.directive';
import {ConfigurableDirective} from './configurable.directive';

export interface Configurable {
  id: string;
  parentId: string;
  zone: string;
  templates?: Record<string, TemplateNameDirective>;
  data?: any;
  dataIndex?: number;
  conditionsData?: Record<string, any>;
  removeEdited: () => void;
  removeSelected: () => void;
  removeHighlight?: () => void;
  addHighlight?: () => void;
  highlight?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfigurableService {
  private _hoveredId?: string;

  /**
   * currently edited element'id.
   * Can be undefined when element is unselected
   */
  edited$ = new BehaviorSubject<Configurable | undefined>(undefined);

  /**
   * behavior subject as we need to retrieve the previous value to toggle it
   */
  editorEnabled$ = new BehaviorSubject<boolean>(false);

  /**
   * previous edited element
   */
  previousConfigurableElement?: Configurable;

  /**
   * configurable service must subscribe to store'changes events (config service)
   */
  configurableDirectiveMap: Map<string, ConfigurableDirective> = new Map<string, ConfigurableDirective>();

  set hoveredId(id: string | undefined) {
    this._hoveredId = id;
  }
  get hoveredId(): string | undefined {
    return this._hoveredId;
  }

  /**
   * Set the hover's id element when not undefined
   * @param {string | undefined} id - The id of the configurable element
   */
  mouseoverConfigurable(id: string | undefined) {
    if (this._hoveredId === undefined) {
      this._hoveredId = id;
    }
  }

  /**
   * Set the hover's id element when different from the current hovered element
   * @param id {string | undefined} id - The id of the configurable element
   */
  mouseenterConfigurable(id: string | undefined) {
    if (id !== this.hoveredId) {
      this._hoveredId = id;
    }
  }

  /**
   * When mouse leave configurable element, set hover's id to undefined
   */
  mouseleaveConfigurable() {
    this._hoveredId = undefined;
  }

  clickConfigurable(configurable: Configurable) {
    if (!this.previousConfigurableElement) {
      // previous is undefined
      this.previousConfigurableElement = configurable;
    }
    else if (this.previousConfigurableElement.id !== configurable.id
      || (this.previousConfigurableElement.id === configurable.id && this.previousConfigurableElement.zone !== configurable.zone)) {
      // previous element exist and his id don't match with the new configurable element

      this.previousConfigurableElement.removeEdited();
      this.previousConfigurableElement.removeSelected();
      this.previousConfigurableElement = configurable;
    }
    else if (this.previousConfigurableElement.id === configurable.id && this.previousConfigurableElement.zone === configurable.zone) {
      // same id and same zone
      this.previousConfigurableElement = undefined;
      this.edited$.next(undefined);
      return;
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

  toggleEditor() {
    const enabled = !this.editorEnabled$.value;
    this.editorEnabled$.next(enabled);
  }
}
