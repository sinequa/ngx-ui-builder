import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentConfig, ConfigService } from '../../configuration/config.service';

@Component({
  selector: 'uib-class-editor',
  template: `
  <label class="form-label" for="classes">CSS Classes</label>
  <input class="form-control" id="classes"
    type="text"
    name="classes"
    [ngModel]="config.classes"
    (ngModelChange)="setClasses($event)"
  />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassEditorComponent {
  @Input() config: ComponentConfig;

  constructor(public configService: ConfigService) {}

  setClasses(value: string) {
    this.config.classes = value;
    this.configService.updateConfig(this.config);
  }
}
