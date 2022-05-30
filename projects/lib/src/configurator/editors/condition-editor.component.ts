import { ChangeDetectionStrategy, Component, Input, OnChanges } from "@angular/core";
import { Condition, ConditionsService, ConditionValue } from "../../conditions/conditions.service";
import { ConfiguratorContext } from "../configurator.models";

@Component({
  selector: 'uib-condition-editor',
  templateUrl: './condition-editor.component.html',
  styles: [`
  .condition-value .btn {
    width: 40px;
  }
  .autocomplete .list-group {
    top: 0;
    width: 100%;
    max-height: 200px;
    overflow: auto;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionEditorComponent implements OnChanges {
  @Input() context: ConfiguratorContext;

  // The data on which the current condition is evaluated
  data: any;
  // The data field on which the current condition is evaluated
  fields: string[];
  // The list of values tested by the current condition
  values: string[];
  // A debug text to understand the current condition
  debugText: string;

  constructor(
    public conditionsService: ConditionsService
  ){}

  ngOnChanges() {
    this.updateConfig(false);
  }

  updateConfig(notify = true) {
    if(this.context.config.condition) {
      this.updateData(this.context.config.condition);
      this.updateFields();
      this.updateValues(this.context.config.condition);
      this.updateDebugText(this.context.config.condition);
    }
    if(notify) {
      this.context.configChanged();
    }
  }

  updateData(condition: Condition) {
    const data = typeof this.context.context.dataIndex === 'undefined'?
      this.context.context.data : this.context.context.data[this.context.context.dataIndex];
    this.data = this.conditionsService.selectData(condition, this.context.context.conditionsData, data);
  }

  updateFields() {
    this.fields = this.data? Object.keys(this.data) : [];
  }

  updateValues(condition: Condition) {
    this.values = [];
    if(condition.field && this.data) {
      if(condition.data || typeof this.context.context.dataIndex === 'undefined') {
        this.addValueToList(this.values, this.data, condition.field);
      }
      // Special case of the data list
      else {
        this.context.context.data.forEach(item => this.addValueToList(this.values, item, condition.field));
      }
    }
  }

  private addValueToList(values: string[], item: any, field: string) {
    const data = item[field]?.toString();
    if(data && !values.includes(data)) {
      values.push(data);
    }
  }

  updateDebugText(condition: Condition) {
    this.debugText = this.conditionsService.writeCondition(condition);
  }

  get activate(): boolean {
    return !!this.context.config.condition;
  }

  set activate(value: boolean) {
    if(value) { // Create a new condition from scratch
      this.context.config.condition = {data: '', type: 'equals', field: '', values: [{value: ''}]};
    }
    else {  // Erase the current condition
      delete this.context.config.condition;
    }
    this.updateConfig();
  }

  addValue() {
    this.context.config.condition?.values.push({value: ''});
  }

  removeValue(i: number) {
    this.context.config.condition?.values.splice(i, 1);
    this.updateConfig();
  }

  selectField(field: string) {
    this.context.config.condition!.field = field;
    this.updateConfig();
  }

  selectValue(value: string, condition: ConditionValue) {
    condition.value = value;
    this.updateConfig();
  }

  // This item instance might change, so we track by index
  trackByFn(index, item) {
    return index;
  }
}
