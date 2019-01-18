import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { User } from 'firebase';
import { Router } from '@angular/router';
import { UserProfile } from '../models/userProfile';
import { UserType } from '../models/userType';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { takeLast, finalize, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  /**
   * Updates the user profile of the user with the specifiedu userId
   * @param userId: string, representing the user`s id
   * @param userProfile: string, representing the user`s profile
   */
  async updateUserProfile(userId: string, userProfile: UserProfile) {
    const displayName = userProfile.lastName
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : userProfile.firstName;
    // userProfile.userType == UserType.Employee
    //   ? `${userProfile.firstName} ${userProfile.lastName}`
    //   : userProfile.companyName;
    return this.afs
      .collection<User>('users')
      .doc(userId)
      .update({ displayName, userProfile });
  }

  /**
   * Updates a user profile picture.
   * @param userId: string, the user`s id
   * @param file: File, the file that will be uploaded
   */
  updateUserPhoto(userId: string, file: File): AngularFireUploadTask {
    const ref = this.storage.ref(userId);
    const task = ref.put(file);
    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          const downloadUrl = await ref.getDownloadURL().toPromise();
          this.afs
            .collection<User>('users')
            .doc(userId)
            .update({ photoUrl: downloadUrl });
        })
      )
      .subscribe();
    return task;
  }

  /**
   * Updates a user`s CV
   * @param userId: string, representing the profile`s user id
   * @param file: File, representing the file that will be uploaded ( Must be a pdf )
   */
  updateUserCv(userId: string, file: File): AngularFireUploadTask {
    const ref = this.storage.ref(`${userId}-cv`);
    const task = ref.put(file);
    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          const downloadUrl = await ref.getDownloadURL().toPromise();
          ({ downloadUrl });
          this.afs
            .collection<User>('users')
            .doc(userId)
            .update({ cvUrl: downloadUrl });
        })
      )
      .subscribe();
    return task;
  }

  /**
   * Delets a user`s CV
   * @param userId: string, representing user`s id
   */
  deleteUserCv(userId: string): Observable<any> {
    this.afs
      .collection<User>('users')
      .doc(userId)
      .update({ cvUrl: null });
    const ref = this.storage.ref(`${userId}-cv`);
    return ref.delete();
  }
}
