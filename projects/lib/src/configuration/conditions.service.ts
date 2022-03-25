import { Injectable } from "@angular/core";


export interface Condition {
  data?: string; // conditionsData selector (or undefined for the main data object)
  field: string; // The field to select from the data object
  type: 'equals' | 'regexp';
  values: ConditionValue[];
  or?: boolean;
}

export interface ConditionValue {
  value: string;
  not?: boolean;
  $regexp?: RegExp;
}


@Injectable({providedIn: 'root'})
export class ConditionsService {

  public selectData(condition: Condition, conditionsData?: Record<string, any>, data?: any): any {
    return condition.data? conditionsData?.[condition.data] : data;
  }

  public check(condition: Condition | undefined, conditionsData?: Record<string, any>, data?: any): boolean {
    if(!condition) return true;
    const selectData = this.selectData(condition, conditionsData, data);
    return this.checkData(condition, selectData);
  }

  public writeCondition(condition: Condition) {
    const operator = condition.or? ') OR (' : ') AND (';
    return '('+condition.values.map(v => this.writeValue(condition, v)).join(operator)+')';
  }

  public writeValue(condition: Condition, value: ConditionValue) {
    if(condition.type === 'regexp') {
      const operator = value.not? '!' : '';
      return `${operator}${condition.data || 'data'}['${condition.field}'].match(/${value.value}/)'`;
    }
    else if (condition.type === 'equals') {
      const operator = value.not? '!==' : '==='
      return `${condition.data || 'data'}['${condition.field}'] ${operator} '${value.value}'`;
    }
    return '';
  }
  
  public checkData(condition: Condition, data?: any) {
    const value = data?.[condition.field]?.toString() || '';
    return this.checkCondition(condition, value);
  }

  private checkCondition(condition: Condition, data: string): boolean {
    if(condition.or) {
      return !!condition.values.find(v => this.checkSingleValue(condition, v, data));
    }
    else {
      return condition.values.every(v => this.checkSingleValue(condition, v, data));
    }
  }

  private checkSingleValue(condition: Condition, value: ConditionValue, data: string) {
    let test;
    if(condition.type === 'regexp') {
      test = this.checkRegexp(value, data);
    }
    else if(condition.type === 'equals') {
      test = this.checkEquals(value, data);
    }
    return test? !value.not : !!value.not;
  }

  
  private checkEquals(condition: ConditionValue, value: string): boolean {
    return condition.value.toLowerCase() === value.toLowerCase();
  }


  private checkRegexp(condition: ConditionValue, value: string) {
    if(!condition.$regexp) {
      try {
        condition.$regexp = new RegExp(condition.value, 'i');
      }
      catch(e) {
        console.warn("Incorrect regular expression ", condition.value);
        return true;
      }
    }
    return value.match(condition.$regexp);
  }

}