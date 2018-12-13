import { DocumentReference } from '@angular/fire/firestore';
import { User } from './user';

export interface Job {
  id: string;
  employerRef?: DocumentReference;
  employer?: { displayName: string; photoUrl: string };
  title: string;
  description: string;
  requirements: string;
  tags?: string[];
  period: string;
  salary?: string;
  publishedDate: Date;
  applications: { date: Date; uid: string }[];
}
