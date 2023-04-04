import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "../configurator.models";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'uib-html-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
  <label class="form-label" for="rawHtml" i18n>Raw HTML:</label>
  <textarea class="form-control" id="rawHtml"
    type="text"
    name="rawHtml"
    rows="15"
    [(ngModel)]="context.config.rawHtml"
    (ngModelChangeDebounced)="context.configChanged()"
  ></textarea>
  `,
  styles: [`
textarea {
  font-family: monospace;
  font-size: 12px !important;
}
  `]
})
export class HtmlEditorComponent {
  @Input() context: ConfiguratorContext;

}