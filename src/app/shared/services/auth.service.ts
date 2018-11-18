import 'firebase/auth';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(
        user =>
          user
            ? this.afs.doc<User>(`users/${user.uid}`).valueChanges()
            : of(null)
      )
    );
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => this.updateUserData(credential.user));
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => this.updateUserData(credential.user));
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => this.updateUserData(user.user));
  }

  signOut() {
    this.afAuth.auth.signOut();
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

    data.photoUrl = user.photoURL ? user.photoURL : "../assets/images/default.jpg";

    return userRef.set(data, { merge: true });
  }
}
