import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new BehaviorSubject<Message>(null);

  constructor() {}

  get message$() {
    return this.messageSubject.asObservable();
  }

  showMessage(message: Message) {
    this.messageSubject.next(message);
  }
}
