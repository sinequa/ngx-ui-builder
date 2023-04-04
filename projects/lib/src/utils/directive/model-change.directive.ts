import { AfterContentInit, Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[ngModelChangeDebounced]',
  standalone: true
})
export class NgModelChangeDebouncedDirective implements OnDestroy, AfterContentInit {
  @Input() ngModelDebounceTime = 1000;
  @Output() ngModelChangeDebounced = new EventEmitter<any>()

  private subs: Subscription;

  constructor(private ngModel: NgModel) {}

  ngAfterContentInit(): void {
    this.subs = this.ngModel.update
    .pipe(
      distinctUntilChanged(),
      debounceTime(this.ngModelDebounceTime),
    )
    .subscribe((value) => {
      this.ngModelChangeDebounced.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}