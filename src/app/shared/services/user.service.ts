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
import { Notification } from '../models/notification';

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

  getUserNotifications(uid: string): Observable<Notification[]> {
    return this.userCollection
      .doc<User>(uid)
      .collection<Notification>('notifications', ref =>
        ref.orderBy('date', 'desc')
      )
      .valueChanges();
  }

  deleteNotification(userId: string, notificationId: string) {
    return this.userCollection
      .doc<User>(userId)
      .collection<Notification>('notifications')
      .doc(notificationId)
      .delete();
  }

  addNotification(userId: string, notification: Notification) {
    const id = this.afs.createId();
    notification.id = id;
    return this.userCollection
      .doc<User>(userId)
      .collection<Notification>('notifications')
      .doc(id)
      .set(notification);
  }

  checkUsersAreLinked(employee: User, employer: User): boolean {
    // check in applications for employer id
    if (!employee.applications) return false;
    return (
      employee.applications.filter(
        application =>
          application.employerRef.id === employer.uid && application.accepted
      ).length !== 0
    );
    // return true;
  }
}
