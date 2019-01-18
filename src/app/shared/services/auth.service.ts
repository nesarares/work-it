import 'firebase/auth';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentReference
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { urls } from '../constants/urls';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubject: Subject<User> = new ReplaySubject<User>(1);
  user: User = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState
      .pipe(
        switchMap(user => {
          if (
            user &&
            user.providerData[0].providerId === 'password' &&
            !user.emailVerified
          ) {
            return of(null);
          }
          return user
            ? this.afs.doc<User>(`users/${user.uid}`).valueChanges()
            : of(null);
        })
      )
      .subscribe(user => {
        console.log({ user });
        this.user = user;
        this.userSubject.next(user);
      });
  }

  get user$(): Observable<User> {
    return this.userSubject.asObservable();
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

    if (!credential.user.emailVerified) {
      throw { code: 'auth/email-not-verified' };
    }

    return credential.user;
  }

  async emailSignUp(email: string, password: string) {
    const user = await this.afAuth.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    user.user.sendEmailVerification();

    return await this.updateUserData(user.user, false);
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  userRef(): Observable<DocumentReference> {
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

  private async updateUserData(user, signin: boolean = true) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

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
