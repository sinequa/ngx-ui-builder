import { Injectable } from '@angular/core';
import { Toast } from 'bootstrap';
import { Subject } from 'rxjs';

export type BsStyle = 'info' | 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'light' | 'dark';

export interface ToastAction {
  text?: string;
  style?: string | string;
  icon?: string;
  hideToast?: boolean;
  action: () => void;
}

export interface ToastMessage {
  icon?: string;
  message: string;
  style?: BsStyle | string;
  actions?: ToastAction[];
  options?: Toast.Options;
}

@Injectable({providedIn: 'root'})
export class ToastService {

  onToastMessage = new Subject<ToastMessage|null>();

  show(
    message: string,
    style: BsStyle | string = 'info',
    actions?: ToastAction[],
    options?: Toast.Options
  ) {
    this.onToastMessage.next({message, style, actions, options});
  }

  hide() {
    this.onToastMessage.next(null);
  }

}
