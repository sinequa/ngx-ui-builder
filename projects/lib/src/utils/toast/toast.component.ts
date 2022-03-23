import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Toast } from 'bootstrap';
import { Subscription } from 'rxjs';
import { ToastService } from './toast.service';

@Component({
  selector: 'uib-toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnDestroy, AfterViewInit {
  @ViewChild('toastRef', {static: true}) el: ElementRef
  
  @Input() options: Toast.Options =  {animation: true, autohide: true, delay: 5000};
  
  toast: Toast;
  message: string;
  
  private sub: Subscription;

  constructor(private toastService: ToastService) {
  }
  
  ngAfterViewInit(): void {
    this.sub = this.toastService.onToastMessage.subscribe((message: string) => {
      this.message = message;
      if (this.el) {
        this.toast = Toast.getOrCreateInstance(this.el.nativeElement, this.options);
        this.toast.show();
      } else {
        console.warn('Toast not found!');
      }
    });    
  }
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
