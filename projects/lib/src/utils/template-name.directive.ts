import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uib-template]',
})
export class TemplateNameDirective {
  @Input('uib-template') templateName: string;
  @Input() display?: string;
  @Input() iconClass?: string;
  @Input() title?: string;

  constructor(public readonly template: TemplateRef<any>) {}
}
