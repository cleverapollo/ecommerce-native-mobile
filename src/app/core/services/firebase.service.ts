import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { DefaultPlatformService } from './platform.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CustomError, CustomErrorType } from '@core/error';
import firebase from 'firebase/app';

export interface FirebaseControllable {
  getIdToken(forceRefresh: boolean): Promise<string>
  onAuthStateChanged(): Observable<any | firebase.User>
  sendEmailVerification():  Promise<any>;
  sendPasswordResetEmail(email: string): Promise<any>;
  setLanguageCode(languageCode: string): void
  signInWithApple(identityToken: string): Promise<any>;
  signInWithEmailAndPassword(email: string, password: string): Promise<any | firebase.auth.UserCredential>
  signInWithFacebook(accessToken: string): Promise<any>
  signInWithGoogle(idToken: string, accessToken: string): Promise<any>
  signOut(): Promise<any>
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements FirebaseControllable {

  constructor(
    private platform: DefaultPlatformService,
    private nativeAuth: FirebaseAuthentication,
    private angularAuth: AngularFireAuth
  ) { }

  async sendEmailVerification(): Promise<any> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.sendEmailVerification();
    } else {
      const authState = await this.getAuthState();
      return authState.sendEmailVerification();
    }
  }

  sendPasswordResetEmail(email: string): Promise<any> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.sendPasswordResetEmail(email);
    } else {
      return this.angularAuth.sendPasswordResetEmail(email);
    }
  }

  signInWithApple(identityToken: string): Promise<any> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.signInWithApple(identityToken);
    } else {
      return Promise.reject(this.signInNotSupportedError('Apple'));
    }
  }

  signInWithFacebook(accessToken: string): Promise<any | firebase.auth.AuthProvider> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.signInWithFacebook(accessToken);
    } else {
      return Promise.reject(this.signInNotSupportedError('Facebook'));
    }
  }

  signInWithGoogle(idToken: string, accessToken: string): Promise<any> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.signInWithGoogle(idToken, accessToken);
    } else {
      return Promise.reject(this.signInNotSupportedError('Google'));
    }
  }

  async getIdToken(forceRefresh: boolean): Promise<string> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.getIdToken(forceRefresh);
    } else {
      const authState = await this.getAuthState();
      return await authState.getIdToken(forceRefresh);
    }
  }

  setLanguageCode(languageCode: string): void {
    if (this.platform.isNativePlatform) {
      this.nativeAuth.setLanguageCode(languageCode);
    } else {
      this.angularAuth.languageCode = new Promise(() => languageCode);
    }
  }

  onAuthStateChanged(): Observable<any | firebase.User> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.onAuthStateChanged()
    } else {
      return new Observable<firebase.User>(observer => {
        this.angularAuth.onAuthStateChanged(observer.next, observer.error, observer.complete);
      });
    }
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<any | firebase.auth.UserCredential> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.signInWithEmailAndPassword(email, password);
    } else {
      return this.angularAuth.signInWithEmailAndPassword(email, password);
    }
  }

  signOut(): Promise<any> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.signOut();
    } else {
      return this.angularAuth.signOut();
    }
  }

  // Helper

  private getAuthState() {
    return this.angularAuth.authState
      .pipe(first())
      .toPromise();
  }

  private signInNotSupportedError(providerName: string): CustomError {
    return new CustomError(
      CustomErrorType.NotSupportedWebFeature,
      `SignIn with ${providerName} is not supported yet`
    );
  }

}

enum FirebaseAuthErrorCode {
  emailAlreadyInUse = 'auth/email-already-in-use',
  invalidEmail = 'auth/invalid-email',
  operationNotAllowed = 'auth/operation-not-allowed',
  weakPassword = 'auth/weak-password',
  userDisabled = 'auth/user-disabled',
  userNotFound = 'auth/user-not-found',
  wrongPassword = 'auth/wrong-password'
}