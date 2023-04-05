import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfiguratorContext } from '../configurator.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'uib-class-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
  <label class="form-label" for="classes" i18n>CSS Classes</label>
  <textarea
    class="form-control"
    id="classes"
    type="text"
    name="classes"
    autocomplete="off"
    spellcheck="false"
    [(ngModel)]="context.config.classes"
    (ngModelChangeDebounced)="context.configChanged()"
  ></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassEditorComponent {
  @Input() context: ConfiguratorContext;

}
