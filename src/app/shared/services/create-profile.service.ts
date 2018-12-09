import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { User } from 'firebase';
import { Router } from '@angular/router';
import { UserProfile } from '../models/userProfile';
@Injectable({
  providedIn: 'root'
})
export class CreateProfileService {
  constructor(private afs: AngularFirestore, private router: Router) {}

  /**
   * Updates the user profile of the user with the specified userId
   */
  async updateUserProfile($userId: string, userProfile: UserProfile) {
    let $user: AngularFirestoreDocument<User>;
    $user = this.afs.collection<User>('users').doc($userId);
    let document = await $user.ref.get();
    if (!document.exists) {
      console.log('Invalid user found, redirecting to main page...');
      this.router.navigate([`/`]);
      return;
    }
    return $user.ref.update({ userProfile: userProfile });
  }
}
