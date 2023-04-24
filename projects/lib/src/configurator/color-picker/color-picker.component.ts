import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ConfiguratorContext } from "../configurator.models";
import { NgModelChangeDebouncedDirective, TooltipDirective } from "../../utils";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'uib-color-picker',
  imports: [CommonModule, FormsModule, TooltipDirective, NgModelChangeDebouncedDirective],
  standalone: true,
  template: `
  <label for="color-{{property}}" class="form-label" *ngIf="label">{{label}}</label>
  <div class="color-picker-wrapper mb-2">
    <input [uib-tooltip]="tooltip"
      type="color"
      id="color-{{property}}"
      class="form-control-color"
      [(ngModel)]="color"
      (ngModelChangeDebounced)="context.configChanged()"/>
      <button class="color-picker-reset" uib-tooltip="Reset color" i18n-uib-tooltip i18n (click)="reset()"></button>
  </div>
  `,
  styles: [`
    :host {
      width: 100px;
    }

    .color-picker-wrapper {
      overflow: hidden;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      box-shadow: 1px 1px 3px 0px grey;
      margin: auto;
    }

    .color-picker-wrapper input[type=color] {
      width: 150%;
      /* height: 150%; */
      padding: 0;
      margin: -25%;
    }

    .color-picker-reset {
      position: relative;
      margin: 0;
      padding: 0;
      width: 125%;
      height: 60%;
      top: -10px;
      left: -5px;
    }
  `]
})
export class ColorPickerComponent implements OnChanges {
  @Input() context: ConfiguratorContext;
  @Input() property: string;
  @Input() label?: string;
  @Input() defaultColor = '#ffffff';
  @Input() tooltip: string = '';

  _path: string[];

  get color() {
    let val = this.context.config;
    for(let p of this._path) {
      val = val[p];
    }
    return <string><unknown>val || this.defaultColor;
  }

  set color(value: string) {
    if(value.toLowerCase() === this.defaultColor.toLowerCase()) {
      value = '';
    }
    let val = this.context.config;
    let i = 0;
    // walk through nested object's properties
    // at the for loop end, val will contains the seeked ref property
    for(; i<this._path.length-1; i++) {
      val = val[this._path[i]];
    }
    // check if the value has changed and set the new value if needed
    if(value !== val[this._path[i]]) {
      val[this._path[i]] = value;
    }
  }

  reset() {
    this.color = "";
    this.context.configChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._path = this.property.split('.');
  }
}
