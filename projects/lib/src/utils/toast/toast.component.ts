import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Toast } from 'bootstrap';
import { Subscription } from 'rxjs';
import { ToastAction, ToastMessage, ToastService } from './toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uib-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styles: [`
  .alert {
    width: 350px;
    max-width: 100%;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    z-index: 1046;
  }
  `]
})
export class ToastComponent implements OnDestroy, AfterViewInit {
  @ViewChild('toastRef', {static: true}) el: ElementRef

  @Input() options: Toast.Options = {animation: true, autohide: true, delay: 5000};

  toast: Toast;
  message: ToastMessage|null;

  private sub: Subscription;

  constructor(private toastService: ToastService) {
  }

  ngAfterViewInit(): void {
    this.sub = this.toastService.onToastMessage.subscribe((message: ToastMessage|null) => {
      this.message = message;
      if (this.el) {
        if(message) {
          this.toast = Toast.getOrCreateInstance(this.el.nativeElement, message.options || this.options);
          this.toast.show();
        }
        else {
          this.toast.hide();
        }
      } else {
        console.warn('Toast not found!');
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onAction(action: ToastAction) {
    action.action();
    if(action.hideToast) {
      this.toast.hide();
    }
  }
}
