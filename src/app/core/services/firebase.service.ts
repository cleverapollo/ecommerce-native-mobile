import { Injectable, NgZone } from '@angular/core';
import { FirebaseAuthentication, SignInResult, User } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import { environment } from '@env/environment';
import { initializeApp } from 'firebase/app';
import { Observable, ReplaySubject, lastValueFrom, take } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private _firebaseUser = new ReplaySubject<User | null>(1);

  constructor(private readonly ngZone: NgZone, private readonly storageService: StorageService) {
    if (!Capacitor.isNativePlatform()) {
      initializeApp(environment.firebaseConfig);
    }
    this.setLanguageCode('de-DE');

    FirebaseAuthentication.removeAllListeners().then(() => {
      FirebaseAuthentication.addListener('authStateChange', change => {
        this.ngZone.run(() => {
          this._firebaseUser.next(change.user);
        });
      });
    });
    // Only needed to support dev livereload.
    FirebaseAuthentication.getCurrentUser().then((result) => {
      this._firebaseUser.next(result.user);
    });
  }

  get firebaseUser$(): Observable<User | null> {
    return this._firebaseUser.asObservable();
  }

  get firebaseUser(): Promise<User | null> {
    return lastValueFrom(this.firebaseUser$.pipe(take(1)));
  }

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

  async getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    if (!(await this.firebaseUser)) {
      return null;
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

  async signInWithEmailAndPassword(email: string, password: string): Promise<SignInResult> {
    return await FirebaseAuthentication.signInWithEmailAndPassword({
      email: email,
      password: password
    });
  }

  signOut(): Promise<void> {
    return FirebaseAuthentication.signOut();
  }

}