import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ConfiguratorContext } from "../configurator.models";
import { NgModelChangeDebouncedDirective } from "../../utils";
import { CommonModule } from "@angular/common";

@Component({
  selector: "uib-image-selector",
  imports: [CommonModule, FormsModule, NgModelChangeDebouncedDirective],
  standalone: true,
  template: `
<div class="form-group">
  <label for="img-{{param}}" class="form-label">{{description}}</label>
  <input type="text"
    class="form-control mb-1"
    id="img-{{param}}"
    autocomplete="off"
    spellcheck="off"
    [(ngModel)]="context.config[param]"
    (ngModelChangeDebounced)="onChange($event)">
  <input type="file" class="form-control-file" accept="image/png, image/jpeg, image/gif" (change)="onImageLoaded($event)">

  <details *ngIf="context.config[param]">
    <summary>
      Preview
    </summary>
    <div>
      <img class="mw-100 border rounded" [src]="context.config[param]">
    </div>
  </details>
</div>
    `
})
export class ImageSelectorComponent {
  @Input() context: ConfiguratorContext;
  @Input() param: string;
  @Input() description: string;

  onImageLoaded(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.context.config[this.param] = reader.result;
          this.context.configChanged();
        }
      }
      reader.readAsDataURL(file);
    }
  }

  onChange(value: string) {
    this.context.configChanged();
  }
}
