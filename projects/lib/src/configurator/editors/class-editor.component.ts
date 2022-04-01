import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfiguratorContext } from '../configurator.models';

@Component({
  selector: 'uib-class-editor',
  template: `
  <label class="form-label" for="classes" i18n>CSS Classes</label>
  <input class="form-control" id="classes"
    type="text"
    name="classes"
    [(ngModel)]="context.config.classes"
    (ngModelChangeDebounced)="context.configChanged()"
  />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassEditorComponent {
  @Input() context: ConfiguratorContext;

}
