import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { TemplateNameDirective } from "../../utils/directive/template-name.directive";

@Injectable()
export class ZoneContextService {
  /**
   * zone's id
   */
  id: string;
  /**
   * additional template's data. If data is an array, an *ngFor will be done using
   * each data's items
   */
  data?: any;
  /**
   * conditional display rules
   */
  conditionsData?: Record<string, unknown>;

  /**
   * TemplateNameDirective's collection
   */
  templates: Record<string, TemplateNameDirective> = {};

  /**
   * When data or conditionsData change, emit changes
   */
  changes$ = new Subject<{data: unknown, conditionsData: Record<string, unknown> | undefined}>();

  update(state:{data: unknown, conditionsData: Record<string, unknown> | undefined}) {
    this.data = state.data;
    this.conditionsData = state.conditionsData;

    this.changes$.next(state);
  }
}