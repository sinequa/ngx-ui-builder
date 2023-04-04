import { Pipe, PipeTransform } from "@angular/core";
import { Condition, ConditionsService } from "./conditions.service";

@Pipe({
  name: 'uibCondition',
  standalone: true
})
export class ConditionPipe implements PipeTransform {

  constructor(
    public conditionService: ConditionsService
  ){}

  transform(value: any, params?: Condition): boolean {
    if(!params) return true;
    return this.conditionService.checkData(params, value);
  }

}
