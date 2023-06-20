import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
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
    [(ngModel)]="context.config?.images[param].filename"
    (ngModelChangeDebounced)="onChange($event)">
  <input type="file" class="form-control-file" accept="image/png, image/jpeg, image/gif" (change)="onImageLoaded($event)">

  <div class="d-flex flex-column mt-3" *ngIf="sizeable">
    <div class="input-group input-group-sm">
      <span class="input-group-text">Width</span>
      <input type="text"
        class="form-control"
        [(ngModel)]="context.config?.images[param].width"
        (ngModelChangeDebounced)="onImageDimensionChange($event, 'width')"
        aria-label="width">
      <span class="input-group-text">px</span>
    </div>
    <input type="range" id="img-{{param}}-width" name="img-{{param}}-width"
      class="form-range mb-3"
      min="0"
      max="1024"
      [(ngModel)]="context.config?.images[param].width"
      (ngModelChangeDebounced)="context.configChanged()">

    <div class="input-group input-group-sm">
      <span class="input-group-text">Height</span>
      <input type="text"
        class="form-control"
        [(ngModel)]="context.config?.images[param].height"
        (ngModelChangeDebounced)="onImageDimensionChange($event, 'height')"
        aria-label="height">
      <span class="input-group-text">px</span>
    </div>
    <input type="range" id="img-{{param}}-height" name="img-{{param}}-height"
      class="form-range mb-3"
      min="0"
      max="1024"
      [(ngModel)]="context.config?.images[param].height"
      (ngModelChangeDebounced)="context.configChanged()">
  </div>

  <details *ngIf="context.config?.images[param]">
    <summary>
      Preview
    </summary>
    <div>
      <img class="mw-100 border rounded" [src]="context.config?.images[param].filename">
    </div>
  </details>
</div>
    `
})
export class ImageSelectorComponent implements OnChanges {
  @Input() context: ConfiguratorContext;
  @Input() param: string;
  @Input() description: string;
  @Input() sizeable: boolean = true;


  ngOnChanges(changes: SimpleChanges): void {
    // TODO: to remove with the next release
    // convert old format to the new one
    if (!this.context.config.images || !this.context.config.images[this.param]) {
      this.context.config.images = {...this.context.config.images, [this.param]: { filename: this.context.config[this.param]}}
      delete this.context.config[this.param];
    }
  }

  onImageLoaded(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.context.config.images[this.param].filename = reader.result;
          this.context.configChanged();
        }
      }
      reader.readAsDataURL(file);
    }
  }

  onImageDimensionChange(value: string, size: 'width' | 'height') {
    if (value.trim().length === 0) {
      this.context.config.images[this.param][size] = undefined;
    }
    this.context.configChanged();
  }

  onChange(value: string) {
    this.context.configChanged();
  }
}
