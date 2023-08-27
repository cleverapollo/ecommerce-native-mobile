import { Injectable } from '@angular/core';
import { FirebaseAuthentication, SignInResult, User } from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  async sendEmailVerification(): Promise<any> {
    const currentUser = this.getCurrentUser();
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
    const currentUser = this.getCurrentUser();
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