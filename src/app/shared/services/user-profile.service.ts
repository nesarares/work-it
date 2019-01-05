import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { User } from 'firebase';
import { Router } from '@angular/router';
import { UserProfile } from '../models/userProfile';
import { UserType } from '../models/userType';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private afs: AngularFirestore, private router: Router) {}

  /**
   * Updates the user profile of the user with the specifiedu serId
   */
  async updateUserProfile(userId: string, userProfile: UserProfile) {
    const displayName =
      userProfile.userType == UserType.Employee
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : userProfile.companyName;
    return this.afs
      .collection<User>('users')
      .doc(userId)
      .update({ displayName, userProfile });
  }
}
