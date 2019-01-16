import { DocumentReference } from '@angular/fire/firestore';

export interface Application {
  date: Date;
  employeeRef?: DocumentReference;
  employee?: { displayName: string; photoUrl: string };
  jobRef?: DocumentReference;
  job?: { title: string; employerName: string; employerPhotoUrl: string };
  employerRef?: DocumentReference;
  message?: string;
  accepted?: boolean;
}
