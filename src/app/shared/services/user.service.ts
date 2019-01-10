import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference
} from '@angular/fire/firestore';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Application } from '../models/application';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.userCollection = this.afs.collection<User>('users');
  }

  getUser(uid: string): Observable<User> {
    return this.userCollection.doc<User>(uid).valueChanges();
  }

  async removeUserApplication(jobRef: DocumentReference) {
    const user = this.authService.user;
    const applications = user.applications.filter(
      application => application.jobRef.id != jobRef.id
    );
    this.userCollection.doc<User>(user.uid).update({ applications });
    const job = await jobRef.get();
    jobRef.update({
      applications: job
        .get('applications')
        .filter(
          (application: Application) => application.employeeRef.id != user.uid
        )
    });
  }
}
