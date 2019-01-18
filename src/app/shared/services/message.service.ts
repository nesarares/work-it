import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new BehaviorSubject<Message>(null);

  constructor() {}

  /**
   * Gets the message as an Observable
   */
  get message$() {
    return this.messageSubject.asObservable();
  }

  /**
   * Shows a given message
   * @param message: Message, the given message
   */
  showMessage(message: Message) {
    this.messageSubject.next(message);
  }
}
