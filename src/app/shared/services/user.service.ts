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
import { Review } from '../models/review';
import { NotificationType } from '../models/notificationType';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userCollection: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.userCollection = this.afs.collection<User>('users');
  }

  /**
   * Gets a specific user from database, based on @param uid
   * @param uid: string, the user`s id
   */
  getUser(uid: string): Observable<User> {
    return this.userCollection.doc<User>(uid).valueChanges();
  }

  /**
   * Removes a user application from a job
   * @param jobRef: DocumentReference, representing the job`s reference
   */
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

  /**
   * Gets the notification list for a user with the id @param uid
   * @param uid: string, user`s id
   */
  getUserNotifications(uid: string): Observable<Notification[]> {
    return this.userCollection
      .doc<User>(uid)
      .collection<Notification>('notifications', ref =>
        ref.orderBy('date', 'desc')
      )
      .valueChanges();
  }

  /**
   * Deletes a user notification
   * @param userId: string, representing the user`s id
   * @param notificationId: string representing the notification`s id
   */
  deleteNotification(userId: string, notificationId: string) {
    return this.userCollection
      .doc<User>(userId)
      .collection<Notification>('notifications')
      .doc(notificationId)
      .delete();
  }

  /**
   * Adds a notification to a user
   * @param userId: string, the id of the user
   * @param notification: string, representing the id of notification
   */
  addNotification(userId: string, notification: Notification) {
    const id = this.afs.createId();
    notification.id = id;
    return this.userCollection
      .doc<User>(userId)
      .collection<Notification>('notifications')
      .doc(id)
      .set(notification);
  }

  /**
   * Gets the user average review score
   * @param reviews: Review[], representing all the reviews for the user
   */
  getUserAverageReview(reviews: Review[]): Number {
    let sum = 0;
    let reviewCount = 0;
    for (let review of reviews) {
      sum = sum + review.stars;
      reviewCount = reviewCount + 1;
    }
    if (reviewCount !== 0) return sum / reviewCount;
    else return 0;
  }

  /**
   * Gets the user`s review list
   * @param uid: string, representing the id of the user
   */
  getUserReviews(uid: string): Observable<Review[]> {
    return this.userCollection
      .doc<User>(uid)
      .collection<Review>('reviews', ref => ref.orderBy('date', 'desc'))
      .valueChanges();
  }

  /**
   * Adds a review
   * @param user: User, representing the user being reviewed
   * @param review: Review, representing the review
   */
  addReview(user: User, review: Review) {
    const id = this.afs.createId();
    review.id = id;
    const ret = this.userCollection
      .doc<User>(user.uid)
      .collection<Review>('reviews')
      .doc(id)
      .set(review);

    const notification: Notification = {
      date: new Date(),
      type: NotificationType.NEW_REVIEW,
      message: `${review.user.displayName} gave you a review!`,
      link: `/user/${user.uid}/public`
    };
    this.addNotification(user.uid, notification);

    return ret;
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
