import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { FirebaseAuthentication, SignInResult, User } from '@capacitor-firebase/authentication';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { AuthService } from '@core/api/auth.service';
import { CustomError, CustomErrorType } from '@core/error';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { SignInResponse, SignupRequest } from '@core/models/signup.model';
import { UserProfile } from '@core/models/user.model';
import { SERVER_URL } from '@env/environment';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Logger } from './log.service';
import { StorageKeys, StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated = new BehaviorSubject<boolean>(null);
  isEmailVerified = new BehaviorSubject<boolean>(null);

  private firebaseUser = new BehaviorSubject<User>(null);

  constructor(
    private storageService: StorageService,
    private cache: CacheService,
    private nativeHttpClient: HTTP,
    private logger: Logger,
    private authApiService: AuthService,
    private firebaseService: FirebaseService
  ) {
    this.firebaseService.setLanguageCode('de-DE');
    this.setupFirebaseIdToken(false);
    this.setupOnAuthStateChangedListener();
  }

  private setupOnAuthStateChangedListener(): Promise<PluginListenerHandle> {
    return FirebaseAuthentication.addListener('authStateChange', state => {
      const user = state.user;
      if (user) {
        this.updateEmailVerificationState(user);
      }
      this.storageService.set(StorageKeys.FIREBASE_USER_INFO, user, true);
      this.firebaseUser.next(user);
    });
  }

  private async updateEmailVerificationState(user: User) {
    try {
      const isEmailVerified = await this.storageService.get<boolean>(StorageKeys.FIREBASE_EMAIL_VERIFIED, true);
      const nextValue = isEmailVerified ?? user.emailVerified
      this.isEmailVerified.next(nextValue);
    } catch (error) {
      this.logger.error(error);
      this.isEmailVerified.next(user.emailVerified);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.storageService.clear();
      await this.cache.clearAll();
      await this.firebaseService.signOut();
      this.updateAuthorizationHeaderForNativeHttpClient(null);
      this.isAuthenticated.next(false);
      return Promise.resolve();
    } catch (error) {
      this.logger.error(error);
      return Promise.resolve();
    }
  }

  private updateAuthorizationHeaderForNativeHttpClient(token: string | null) {
    if (!Capacitor.isNativePlatform()) { return }
    const value = token ? `Bearer ${token}` : null;
    this.nativeHttpClient.setHeader(SERVER_URL, 'Authorization', value as any);
  }

  async signup(signupRequest: SignupRequest) {
    try {
      await this.authApiService.signup(signupRequest).toPromise();
      await this.emailPasswordSignIn(signupRequest.email, signupRequest.password);
      await this.sendVerificationMail();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async emailPasswordSignIn(email: string, password: string): Promise<SignInResponse> {
    try {
      const signInResponse = await this.authApiService.signInWithEmailAndPassword({
        username: email,
        password
      }).toPromise();

      // firebase sign in
      await this.firebaseService.signInWithEmailAndPassword(email, password);
      await this.setupFirebaseIdToken(true);
      await this.storageService.set(StorageKeys.CREDENTIALS, { email, password }, true);

      return signInResponse;
    } catch (error) {
      let errorMessage: string | null = 'Deine Anmeldung ist fehlgeschlagen.'
      if (error instanceof HttpErrorResponse) {
        errorMessage = this.getErrorMessageForWanticLogin(error);
      } else if (typeof error === 'string') {
        errorMessage = this.getFirebaseAuthErrorMessage(error);
      }
      return Promise.reject(errorMessage);
    }
  }

  private getErrorMessageForWanticLogin(error: HttpErrorResponse) {
    let errorMessage = 'Die Anmeldung ist fehlgeschlagen.';
    switch (error.status) {
      case HttpStatusCodes.UNAUTHORIZED:
        errorMessage = 'Du hast dein Passwort falsch eingegeben.';
        break;
      case HttpStatusCodes.FORBIDDEN:
        errorMessage = 'Dein Account ist noch nicht freigeschaltet. Um deinen Account zu aktivieren musst du dich zunächst registrieren.';
        break;
      case HttpStatusCodes.NOT_FOUND:
        errorMessage = 'Ein Benutzer mit der angegebenen E-Mail-Adresse wurde nicht gefunden';
        break;
      case HttpStatusCodes.LOCKED:
        errorMessage = 'Dein Account ist gesperrt.';
        break;
    }
    return errorMessage;
  }

  async facebookSignIn(): Promise<{ facebookLoginResponse: SignInResult, user: UserProfile }> {
    const facebookLoginResponse = await this.firebaseService.signInWithFacebook();
    const wanticSignInResponse = await this.wanticSignIn();
    return {
      facebookLoginResponse,
      user: wanticSignInResponse.user
    }
  }

  async googlePlusSignIn(): Promise<{ googlePlusLoginResponse: SignInResult, user: UserProfile }> {
    const googlePlusLoginResponse = await this.firebaseService.signInWithGoogle();
    const wanticSignInResponse = await this.wanticSignIn();
    return {
      googlePlusLoginResponse,
      user: wanticSignInResponse.user
    }
  }

  async appleSignIn(): Promise<{ appleSignInResponse: SignInResult, user: UserProfile }> {
    const appleSignInResponse = await this.firebaseService.signInWithApple();
    const wanticSignInResponse = await this.wanticSignIn();
    return {
      appleSignInResponse,
      user: wanticSignInResponse.user
    };
  }

  async wanticSignIn(): Promise<SignInResponse> {
    const userInfo = this.firebaseUser.value;
    if (userInfo?.uid && userInfo?.email) {
      const signInRequestBody = { uid: userInfo.uid, email: userInfo.email };
      return await this.authApiService.signInWithThirdPartyAuthProvider(signInRequestBody).toPromise();
    }
    const error = new CustomError(CustomErrorType.SignInError, 'email or uid missing ');
    this.logger.error(error.message, userInfo);
    return Promise.reject(error);
  }

  async setupFirebaseIdToken(forceRefresh: boolean = false): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      this.isAuthenticated.next(false);
      return null;
    }

    try {
      const idToken = await this.firebaseService.getIdToken(forceRefresh);
      if (idToken) {
        await this.updateToken(idToken);
        return idToken;
      }
      return idToken;
    } catch (error) {
      this.logger.error('failed to refresh firebase id token', error);
      if (this.isAuthenticated.value === null) {
        this.isAuthenticated.next(false);
      }
      throw error;
    }
  }

  private async updateToken(token: string): Promise<void> {
    if (!token) {
      this.isAuthenticated.next(false);
      throw new Error('token to upate is invalid');
    }
    await this.storageService.set(StorageKeys.FIREBASE_ID_TOKEN, token, true);
    this.updateAuthorizationHeaderForNativeHttpClient(token);
    this.isAuthenticated.next(true);
  }

  private getFirebaseAuthErrorMessage(error: any): string | null {
    let errorMessage = 'Deine Anmeldung ist fehlgeschlagen';
    if (error === 'User cancelled.') {
      return null;
    }
    return errorMessage;
  }

  sendVerificationMail(): Promise<any> {
    return this.firebaseService.sendEmailVerification();
  }

  resetPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authApiService.resetPassword(email).toPromise().then(() => {
        this.firebaseService.sendPasswordResetEmail(email)
          .then(() => resolve())
          .catch(() => reject())
      }, () => reject())
    })
  }

  updateEmailVerificationStatus(emailVerified: boolean) {
    this.isEmailVerified.next(emailVerified);
    this.storageService.set(StorageKeys.FIREBASE_EMAIL_VERIFIED, emailVerified, true);
  }

  async removeDeprecatedAuthToken(): Promise<void> {
    const authToken = await this.storageService.get<string>(StorageKeys.AUTH_TOKEN, true);
    if (authToken) {
      await this.storageService.remove(StorageKeys.AUTH_TOKEN, true)
    }
    return Promise.resolve();
  }

  async migrateSavedCredentials(): Promise<{ email: string, password: string }> {
    try {
      const email = await this.storageService.get<string>(StorageKeys.LOGIN_EMAIL, true);
      const password = await this.storageService.get<string>(StorageKeys.LOGIN_PASSWORD, true);
      let credentials = null;
      if (email && password) {
        credentials = { email, password };
        this.storageService.set(StorageKeys.CREDENTIALS, credentials, true);
      }
      await this.storageService.remove(StorageKeys.LOGIN_EMAIL, true);
      await this.storageService.remove(StorageKeys.LOGIN_PASSWORD, true);
      return Promise.resolve(credentials);
    } catch (error) {
      return Promise.resolve(null);
    }
  }

}
