import { DocumentReference } from '@angular/fire/firestore';

export interface Review {
  id?: string;
  date?: Date;
  userRef?: DocumentReference;
  user?: { displayName: string; photoUrl: string };
  message: string;
  stars: number;
}
