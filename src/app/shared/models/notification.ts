import { NotificationType } from './notificationType';

export interface Notification {
  id?: string;
  date: Date;
  message: string;
  type: NotificationType;
  link?: string;
}
