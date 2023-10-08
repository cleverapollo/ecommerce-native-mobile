import { Injectable } from '@angular/core';
import { FirebaseAuthentication, SignInResult, User } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import { environment } from '@env/environment';
import { getApp, initializeApp } from 'firebase/app';
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() {
    if (!Capacitor.isNativePlatform()) {
      initializeApp(environment.firebaseConfig);
    }
  }

  async getFirebaseAuth() {
    if (Capacitor.isNativePlatform()) {
      return initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
      });
    } else {
      return getAuth();
    }
  };

  async sendEmailVerification(): Promise<any> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return;
    }
    await FirebaseAuthentication.sendEmailVerification();
  }

  private async getCurrentUser(): Promise<User> {
    const result = await FirebaseAuthentication.getCurrentUser();
    return result.user;
  };

  sendPasswordResetEmail(email: string): Promise<void> {
    return FirebaseAuthentication.sendPasswordResetEmail({
      email: email
    });
  }

  signInWithApple(): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithApple();
  }

  signInWithFacebook(): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithFacebook({
      scopes: ['email', 'public_profile']
    });
  }

  signInWithGoogle(): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithGoogle();
  }

  async getIdToken(forceRefresh: boolean): Promise<string> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return;
    }
    const result = await FirebaseAuthentication.getIdToken({
      forceRefresh: forceRefresh
    });
    return result.token;
  }

  setLanguageCode(languageCode: string): Promise<void> {
    return FirebaseAuthentication.setLanguageCode({
      languageCode: languageCode
    })
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithEmailAndPassword({
      email: email,
      password: password
    });
  }

  signOut(): Promise<void> {
    return FirebaseAuthentication.signOut();
  }

}