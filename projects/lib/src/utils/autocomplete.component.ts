import { Component, Input, OnInit, Output, EventEmitter, ContentChild, TemplateRef } from "@angular/core";
import { fromEvent, merge, Observable, of } from "rxjs";
import { filter, switchMap } from "rxjs/operators";

@Component({
  selector: 'uib-autocomplete',
  template: `
<div class="position-relative" *ngIf="suggests$ | async as suggests" (mousedown)="clickInProgress = true" (mouseup)="clickInProgress = false">
  <div class="card list-group list-group-flush position-absolute" *ngIf="suggests.length">
    <div *ngFor="let suggest of suggests" class="list-group-item-action px-2 py-1" (click)="onSelect(suggest)">
      <ng-container *ngTemplateOutlet="itemTpl || defaultTpl; context:{$implicit: suggest}"></ng-container>
    </div>
  </div>
</div>

<ng-template #defaultTpl let-suggest>{{suggest}}</ng-template>
  `,
  styles: [`
.card {
  z-index: 3;
  box-shadow: 0 5px 7px rgb(0 0 0 / 8%);
}
.list-group {
  top: 0;
  width: 100%;
  max-height: 200px;
  overflow: auto;
}
.list-group-item-action {
  cursor: pointer;
}
`]
})
export class AutocompleteComponent implements OnInit {
  @Input() inputElement: HTMLInputElement;
  @Input() suggestGenerator?: (value: string) => Observable<string[]>;
  @Input() allSuggests?: string[];
  @Output() select = new EventEmitter<string>();
  @ContentChild("itemTpl", {static: false}) itemTpl: TemplateRef<any>;
  suggests$ = new Observable<string[]>();
  clickInProgress = false;

  ngOnInit() {
    this.suggests$ = merge(
      fromEvent(this.inputElement, 'input'),
      fromEvent(this.inputElement, 'focus'),
      fromEvent(this.inputElement, 'blur').pipe(filter(() => (!this.clickInProgress))), // Filter out blur event caused by a click on the autocomplete
      this.select // Hide the autocomplete when an item has been selected
    ).pipe(
      switchMap(event => {
        if(typeof event !== 'string' && event.type !== 'blur') {
          if(this.suggestGenerator) {
            return this.suggestGenerator(this.inputElement.value);
          }
          else if(this.allSuggests) {
            return of(this.allSuggests.filter(suggest => suggest !== this.inputElement.value && suggest.includes(this.inputElement.value)));
          }
        }
        return of([]);
      })
    );
  }

  onSelect(value: string) {
    this.inputElement.value = value;
    this.select.next(value);
  }

}