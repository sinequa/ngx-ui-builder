import { Component, Input } from '@angular/core';
import {
  ComponentConfig,
  ConfigService,
} from '../configuration/config.service';

@Component({
  selector: 'uib-class-editor',
  template: `
<div class="d-flex">
  <label for="classes">Classes:</label>
  <input
    type="text"
    id="classes"
    name="classes"
    class="flex-grow-1"
    [ngModel]="config.classes"
    (ngModelChange)="setClasses($event)"
  />
</div>
  `,
})
export class ClassEditorComponent {
  @Input() config: ComponentConfig;

  constructor(public configService: ConfigService) {}

  setClasses(value: string) {
    this.config.classes = value;
    this.configService.updateConfig(this.config);
  }
}
