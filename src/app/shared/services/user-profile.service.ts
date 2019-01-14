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
   * Updates the user profile of the user with the specifiedu serId
   */
  async updateUserProfile(userId: string, userProfile: UserProfile) {
    console.log('update');
    console.log({ userId });
    console.log({ userProfile });
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

  updateUserPhoto(userId: string, file: File): AngularFireUploadTask {
    const ref = this.storage.ref(userId);
    const task = ref.put(file);
    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          const downloadUrl = await ref.getDownloadURL().toPromise();
          console.log({ downloadUrl });
          this.afs
            .collection<User>('users')
            .doc(userId)
            .update({ photoUrl: downloadUrl });
        })
      )
      .subscribe();
    return task;
  }

  updateUserCv(userId: string, file: File): AngularFireUploadTask {
    const ref = this.storage.ref(`${userId}-cv`);
    const task = ref.put(file);
    task
      .snapshotChanges()
      .pipe(
        finalize(async () => {
          const downloadUrl = await ref.getDownloadURL().toPromise();
          console.log({ downloadUrl });
          this.afs
            .collection<User>('users')
            .doc(userId)
            .update({ cvUrl: downloadUrl });
        })
      )
      .subscribe();
    return task;
  }
}
