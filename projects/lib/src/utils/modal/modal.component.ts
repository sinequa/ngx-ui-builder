import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from "@angular/core";
import { Modal } from "bootstrap";

@Component({
    selector: 'uib-modal',
    template: `
  <div class="modal fade" #modal tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" (click)="onModalClose(true)">OK</button>
        </div>
      </div>
    </div>
  </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('modal', {static: true}) el: ElementRef;
  @Input() title: string;
  @Input() show: boolean;
  @Output() close = new EventEmitter<boolean>();

  modal?: Modal;

  ngOnChanges() {
    if(this.show && !this.modal) {
      this.modal = Modal.getOrCreateInstance(this.el.nativeElement, {backdrop: false}); // Backdrop causes issues when the modal is embedded in a fixed container
      this.modal.show();
    }
  }

  ngOnDestroy() {
    this.modal?.dispose();
  }
    
  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('hidden.bs.modal', () => this.onModalClose(false));
  }
  
  onModalClose(success: boolean) {
    this.close.next(success);
    this.modal?.hide();
    this.modal = undefined;
  }
}
