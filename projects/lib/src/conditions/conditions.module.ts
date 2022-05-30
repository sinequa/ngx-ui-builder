
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConditionPipe } from './condition.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ConditionPipe],
  exports: [ConditionPipe]
})
export class ConditionsModule {}
