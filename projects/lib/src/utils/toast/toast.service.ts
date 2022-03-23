import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ToastService {
  
  onToastMessage = new Subject<string>();
  
  constructor() {}
  
  info(message:string) { this.onToastMessage.next(message) }
  
}