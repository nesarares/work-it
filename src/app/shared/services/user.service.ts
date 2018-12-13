import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afs: AngularFirestore) {}

  addJobApplication(user: User, date: Date, jobId: string) {
    const application = { date, jobId };
    user.applications.push(application);
    this.afs
      .collection('users')
      .doc(user.uid)
      .set(user);
  }
}
