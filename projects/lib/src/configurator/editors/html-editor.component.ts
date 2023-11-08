import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "../configurator.models";
import { FormsModule } from "@angular/forms";
import { NgModelChangeDebouncedDirective } from "../../utils";

@Component({
  selector: 'uib-html-editor',
  standalone: true,
  imports: [FormsModule, NgModelChangeDebouncedDirective],
  template: `
  <label class="form-label m-0" for="rawHtml" i18n>Raw HTML:</label>
  <p class="small text-muted mb-1">Static HTML content (text, images). Does not support Angular component and syntax.</p>
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