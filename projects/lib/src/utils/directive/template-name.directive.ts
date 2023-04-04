import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uib-template]',
  standalone: true
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
  @Input('uib-templateDisplay') display?: string;
  /**
   * icon used by the configurator to identify the component
   */
  @Input('uib-templateIconClass') iconClass?: string;
  /**
   * description used by the configurator
   */
  @Input('uib-templateDescription') description?: string;

  templateRef: TemplateRef<any>;

  constructor(protected readonly _templateRef: TemplateRef<any>) {
    this.templateRef = _templateRef;
  }
}
