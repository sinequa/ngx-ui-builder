import { Component, Input } from '@angular/core';
import {
  ComponentConfig,
  ConfigService,
} from '../configuration/config.service';

@Component({
  selector: 'uib-class-editor',
  template: `
<div class="mb-3 pe-4">
  <label class="form-label" for="classes">Classes</label>
  <input class="form-control" id="classes"
    type="text"
    name="classes"
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
