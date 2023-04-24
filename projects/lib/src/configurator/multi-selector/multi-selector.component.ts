import { CommonModule } from "@angular/common";
import { Component, forwardRef, HostBinding, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DndDropEvent, DndModule } from "ngx-drag-drop";

@Component({
  selector: "uib-multi-selector",
  imports: [CommonModule, DndModule],
  standalone: true,
  templateUrl: './multi-selector.component.html',
  styles: [`
  .dndDraggable, .dndDraggable label {
    cursor: grab;
  }
  [dndPlaceholderRef] {
    height: 1rem;
    background: #ccc;
    border: dotted 3px #999;
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
  :host {
    max-height: var(--multi-select-max-height);
    overflow: auto;
    margin-bottom: 0.5rem;
  }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
  }],
  host: {
    class: "form-control"
  }
})
export class MultiSelectComponent<T> implements OnChanges, ControlValueAccessor {
  @Input() options: T[] | undefined;
  @Input() enableReorder = false;
  @Input() valueField?: string;
  @Input() displayField?: string;
  @Input() compareWith: (a: T, b:T) => boolean = Object.is;
  @Input() @HostBinding("style.--multi-select-max-height") maxHeight = "300px";

  // Copy of options, so we can change the order without affecting the original list of options
  // If the options change, the order is reinitialized.
  _options: T[] | undefined;
  _optionsSelected: (T|null)[] | undefined;

  _values: T[] | undefined;

  static idCpt = 0;
  selectId: string;

  constructor(){
    this.selectId = `select-${MultiSelectComponent.idCpt++}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.options) {
      this._options = undefined;
      this.updateOptions();
    }
  }

  updateOptions() {
    if(this.options) {
      this._options = [...this.options];
      if(this.enableReorder && this._values) {
        this._optionsSelected = this._values.map(val => {
          const i = this._options!.findIndex(o => this.compareWith(val, this.getValue(o))); // For each value, find its corresponding option
          return i !== -1? this._options!.splice(i, 1)[0] : null; // i === -1 can happen with incomplete list of metadata. null allows the Drag & Drop directive to have the right number of items
        });
      }
    }
  }

  getValue(option: T) {
    return this.valueField? option[this.valueField] : option;
  }

  valueIndex(value: T) {
    return this._values?.findIndex(v => this.compareWith(v, value)) ?? -1;
  }

  isChecked(option: T): boolean {
    if(!this._values) return false;
    const value = this.getValue(option);
    return this.valueIndex(value) !== -1;
  }

  onChecked(option: T, checked: boolean) {
    if(!this._values) {
      this._values = [];
    }
    const value = this.getValue(option);
    if(checked) {
      this._values.push(value);
    }
    else {
      this._values.splice(this.valueIndex(value), 1);
    }
    this.triggerChange();
  }

  onDrop(event: DndDropEvent) {
    const oldIdx = event.data;
    const newIdx = event.index;
    if(this._values && typeof oldIdx === 'number' && typeof newIdx === 'number' && oldIdx !== newIdx) {
      const [obj] = this._values.splice(oldIdx, 1);
      this._values?.splice(newIdx<oldIdx? newIdx : newIdx-1, 0, obj);
      this.triggerChange();
    }
  }

  triggerChange() {
    this.updateOptions();
    this.onChange(this._values);
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(obj: T[]): void {
    this._values = obj;
    this.updateOptions();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
