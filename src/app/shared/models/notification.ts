import { NotificationType } from './notificationType';

export interface Notification {
  date: Date;
  message: string;
  type: NotificationType;
}
