import { DocumentReference } from '@angular/fire/firestore';
import { User } from './user';

export interface Job {
  id: string;
  employerRef?: DocumentReference;
  employer?: User;
  title: string;
  description: string;
  requirements: string;
  tags?: string[];
  period: string;
  salary?: string;
}
