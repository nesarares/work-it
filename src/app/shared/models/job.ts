import { DocumentReference } from '@angular/fire/firestore';
import { User } from './user';
import { Application } from './application';

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  period: string;
  publishedDate: Date;
  city: string;
  applications?: Application[];
  employerRef?: DocumentReference;
  employer?: { displayName: string; photoUrl: string };
  tags?: string[];
  salary?: string;
}
