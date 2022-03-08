import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ConfiguratorContext } from "../configurator.models";

@Component({
  selector: 'uib-condition-editor',
  templateUrl: './condition-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionEditorComponent {
  @Input() context: ConfiguratorContext;

  get activate(): boolean {
    return !!this.context.config.condition;
  }

  set activate(value: boolean) {
    if(value) {
      this.context.config.condition = {data: '', type: 'equals', field: '', values: [{value: ''}]};
    }
    else {
      delete this.context.config.condition;
    }
    this.context.configChanged();
  }

  addValue() {
    this.context.config.condition?.values.push({value: ''});
  }

  removeValue(i: number) {
    this.context.config.condition?.values.splice(i, 1);
    this.context.configChanged();
  }

  trackByFn(index, item) {
    return index;
  }
}