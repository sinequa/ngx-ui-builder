import { ChangeDetectionStrategy, Component, Input, OnChanges } from "@angular/core";
import { ComponentConfig, ConfigService } from "../../configuration";

@Component({
  selector: 'uib-condition-editor',
  templateUrl: './condition-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionEditorComponent implements OnChanges {
  @Input() config: ComponentConfig;

  field: string;
  value: string;

  constructor(
    public configService: ConfigService
  ){}

  ngOnChanges() {
    this.field = this.config.condition?.field || '';
    this.value = this.config.condition?.value || '';
  }

  updateCondition() {
    if(this.field) {
      this.config.condition = {field: this.field, value: this.value};
    }
    else {
      delete this.config.condition;
    }
    this.configService.updateConfig(this.config);
  }
}