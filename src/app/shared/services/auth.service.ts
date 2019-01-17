import 'firebase/auth';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentReference
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, tap, take } from 'rxjs/operators';

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
      switchMap(user => {
        // console.log({ user });
        return user
          ? this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          : of(null);
      }),
      tap(user => {
        this.user = user;
      })
    );
  }

  async googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return await this.oAuthLogin(provider);
  }

  async facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return await this.oAuthLogin(provider);
  }

  async emailLogin(email: string, password: string) {
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(
      email,
      password
    );
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${credential.user.uid}`
    );
    this.user$ = userRef.valueChanges();
    return credential.user;
  }

  async emailSignUp(email: string, password: string) {
    const user = await this.afAuth.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const userN = await this.updateUserData(user.user);
    return userN;
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.user$ = of(null);
    this.user = null;
    this.router.navigate(['/login']);
  }

  userRef(): Observable<DocumentReference> {
    // TODO: replace this.user.uid to user$ (this.user can be null)
    if (this.user)
      return of(this.afs.collection('users').doc(this.user.uid).ref);
    return this.user$.pipe(
      switchMap((user: User) => {
        return user
          ? of(this.afs.collection('users').doc(user.uid).ref)
          : of(null);
      })
    );
  }

  private async oAuthLogin(provider) {
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    await this.updateUserData(credential.user);
    return credential.user;
  }

  private async updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    this.user$ = userRef.valueChanges();

    const existingUser: User = (await userRef.ref.get()).data() as User;
    if (existingUser && existingUser.userProfile) return;

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ? user.displayName : user.email
    };

    data.photoUrl = user.photoURL ? user.photoURL : urls.defaultPhoto;

    if (data.photoUrl.startsWith('https://graph.facebook.com')) {
      data.photoUrl = data.photoUrl.concat('?height=250');
    }

    await userRef.set(data, { merge: true });
    return data;
  }
}
