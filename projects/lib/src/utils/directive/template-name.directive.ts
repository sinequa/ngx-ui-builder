import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uib-template]',
})
export class TemplateNameDirective {
  /**
   * template's name
   */
  @Input('uib-template') name: string;

  // Properties below are used by the configurator
  /**
   * name used by the configurator to identify the component
   */
  @Input() display?: string;
  /**
   * icon used by the configurator to identify the component
   */
  @Input() iconClass?: string;
  /**
   * title used by the configurator
   */
  @Input() title?: string;

  templateRef: TemplateRef<any>;

  constructor(protected readonly _templateRef: TemplateRef<any>) {
    this.templateRef = _templateRef;
  }
}
