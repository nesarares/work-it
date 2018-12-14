import 'firebase/auth';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { Router } from '@angular/router';
import { urls } from '../constants/urls';
import { UserType } from '../models/userType';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  user: User = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user =>
        user ? this.afs.doc<User>(`users/${user.uid}`).valueChanges() : of(null)
      ),
      tap(user => (this.user = user))
    );
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        return credential.user;
      });
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.updateUserData(user.user);
        return user;
      });
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  get userRef() {
    // TODO: replace this.user.uid to user$ (this.user can be null)
    return this.afs.collection('users').doc(this.user.uid).ref;
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUserData(credential.user);
      return credential.user;
    });
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ? user.displayName : user.email
    };

    data.photoUrl = user.photoURL ? user.photoURL : urls.defaultPhoto;
    return userRef.set(data, { merge: true });
  }
}
