import { Component } from '@angular/core';
import { ConfigurableDirective } from '../configurable/configurable.directive';

/**
 * This component is used as a template for dynamically generated
 * components created by the DynamicComponentService.
 *
 * It extends the configurable directive so that such dynamic
 * components remain clickable (to edit the template or change
 * the classes)
 */
@Component({ template: '' })
export class Template extends ConfigurableDirective {
  classes?: string;
  data: any;

  get _class() {
    return `${this.classes} ${super._class}`;
  }
}
