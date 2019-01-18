import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import {
  Transition,
  TransitionDirection,
  TransitionController
} from 'ng2-semantic-ui';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.less']
})
export class MessageComponent implements OnInit {
  message: Message;
  transitionController = new TransitionController();

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.message$.subscribe(message =>
      this.showMessage(message)
    );
  }

  showMessage(message: Message) {
    if (message == null) return;

    this.message = message;
    this.animate(TransitionDirection.In);
    setTimeout(() => this.animate(TransitionDirection.Out), 3000);
  }

  animate(direction: TransitionDirection) {
    this.transitionController.animate(
      new Transition('drop', 500, direction, () => {})
    );
  }
}
