import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService, StorageKeys } from './storage.service';
import { CacheService } from 'ionic-cache';
import { HTTP } from '@ionic-native/http/ngx';
import { LogService } from './log.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AuthService } from '@core/api/auth.service';
import { SignInResponse, SignupRequest } from '@core/models/signup.model';
import { AppleSignInResponse, ASAuthorizationAppleIDRequest, SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { UserProfile } from '@core/models/user.model';
import { environment, SERVER_URL } from '@env/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { Plugins } from '@capacitor/core';

const { Device } = Plugins;

export interface AppAuthenticationService {
  signup(signupRequest: SignupRequest): Promise<void>;
  emailPasswordSignIn(email: string, password: string): Promise<SignInResponse>;
  facebookSignIn(): Promise<{facebookLoginResponse: FacebookLoginResponse, user: UserProfile}>;
  googlePlusSignIn(): Promise<{googlePlusLoginResponse: any, user: UserProfile}>;
  appleSignIn(): Promise<{appleSignInResponse: AppleSignInResponse, user: UserProfile}>;
  wanticSignIn(): Promise<SignInResponse>;
  logout(): Promise<void>;
  getFirebaseIdToken(forceRefresh: boolean): Promise<string>;
  sendVerificationMail(): Promise<any>;
  resetPassword(email: string): Promise<void>;
  updateEmailVerificationStatus(emailVerified: boolean): void;
  removeDeprecatedAuthToken(): Promise<void>;
  migrateSavedCredentials(): Promise<{email: string, password: string}>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements AppAuthenticationService {

  isAuthenticated = new BehaviorSubject<boolean>(null);
  isEmailVerified = new BehaviorSubject<boolean>(null);
  userInfo = new BehaviorSubject<any>(null);

  constructor(
    private storageService: StorageService, 
    private platform: Platform,
    private cache: CacheService,
    private nativeHttpClient: HTTP,
    private logger: LogService,
    private firebaseAuthentication: FirebaseAuthentication,
    private authApiService: AuthService,
    private facebook: Facebook,
    private googlePlus: GooglePlus,
    private signInWithApple: SignInWithApple,
  ) { 
    if (this.platform.is('capacitor')) {
      this.configFirebaseAuthentication();
      this.getFirebaseIdToken(false);
      this.loadUserData();
    } else {
      this.isAuthenticated.next(false);
    }
  }

  private configFirebaseAuthentication() {
    this.firebaseAuthentication.setLanguageCode('de-DE');
  }

  private loadUserData() {
    this.firebaseAuthentication.onAuthStateChanged().subscribe(userInfo => {
      this.logger.info('user info', userInfo);
      if (userInfo) {
        this.storageService.set(StorageKeys.FIREBASE_USER_INFO, userInfo, true);
        this.userInfo.next(userInfo);
        this.storageService.get<boolean>(StorageKeys.FIREBASE_EMAIL_VERIFIED, true).then(isEmailVerified => {
          if (isEmailVerified !== null) {
            this.isEmailVerified.next(isEmailVerified);
          } else {
            this.isEmailVerified.next(userInfo.emailVerified);
          }
        }, error => {
          this.logger.error(error);
          this.isEmailVerified.next(userInfo.emailVerified);
        })
      } else {
        this.userInfo.next(null);
        this.storageService.set(StorageKeys.FIREBASE_USER_INFO, null, true);
      }
    })
  }

  async logout(): Promise<void> {
    try {
      await this.storageService.clear();
      await this.cache.clearAll();
      this.removeAuthorizationHeaderForNativeHttpClient();
      this.isAuthenticated.next(false);
      await this.firebaseAuthentication.signOut();
      return Promise.resolve();
    } catch (error) {
      this.logger.error(error);
      return Promise.resolve();
    }
  }

  private updateAuthorizationHeaderForNativeHttpClient(token: string) {
    if (this.platform.is('capacitor') && token) {
      this.nativeHttpClient.setHeader(SERVER_URL, 'Authorization', `Bearer ${token}`);
    }
  }

  private removeAuthorizationHeaderForNativeHttpClient() {
    if (this.platform.is('capacitor')) {
      this.nativeHttpClient.setHeader(SERVER_URL, 'Authorization', null);
    }
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
      // wantic sign in
      const signInRequest = { username: email, password: password };
      const signInResponse = await this.authApiService.signInWithEmailAndPassword(signInRequest).toPromise();

      // firebase sign in
      await this.firebaseAuthentication.signInWithEmailAndPassword(email, password);
      await this.getFirebaseIdToken(true);
      await this.storageService.set(StorageKeys.CREDENTIALS, { email: email, password: password }, true);

      return Promise.resolve(signInResponse);
    } catch (error) {
      let errorMessage = 'Deine Anmeldung ist fehlgeschlagen.'
      if (error instanceof HttpErrorResponse) {
        errorMessage = this.getErrorMessageForWanticLogin(error);
      } else if (typeof error === 'string') {
        errorMessage = this.getFirebaseAuthErrorMessage(error);
      }
      return Promise.reject(errorMessage);
    }
  }

  private getErrorMessageForWanticLogin(error: HttpErrorResponse) {
    let errorMessage: string = 'Die Anmeldung ist fehlgeschlagen.';
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

  async facebookSignIn(): Promise<{facebookLoginResponse: FacebookLoginResponse, user: UserProfile}> {
    try {
      // facebook sign in
      const facebookLoginResponse = await this.facebook.login(['email', 'public_profile']);
      const accessToken = facebookLoginResponse?.authResponse?.accessToken;
      
      if (facebookLoginResponse.status === 'connected') {
        if (accessToken) {
          // firebase sign in
          await this.firebaseAuthentication.signInWithFacebook(accessToken);

          // wantic sign in 
          const wanticSignInResponse = await this.wanticSignIn();
          return Promise.resolve({ facebookLoginResponse: facebookLoginResponse, user: wanticSignInResponse.user });
        } {
          const error = 'no valid access token';
          this.logger.error(error);
          return Promise.reject(error);
        }
      } else if (facebookLoginResponse.status === 'not_authorized') {
        const error = 'The user has not authorized your application';
        this.logger.debug(error);
        return Promise.reject(error);
      } else {
        const error = 'The user is not logged in to Faceebook.';
        this.logger.debug(error);
        return Promise.reject(error);
      }
    } catch (error) {
      this.logger.error(error);
      const firebaseAuthErrorMessage = this.getFirebaseAuthErrorMessage(error);
      return Promise.reject(firebaseAuthErrorMessage);
    }
  }

  async googlePlusSignIn(): Promise<{googlePlusLoginResponse: any, user: UserProfile}> {
    try {
      // google plus sign in
      const signInOptions = await this.getSignInOptions();
      const googlePlusLoginResponse = await this.googlePlus.login(signInOptions);
      const idToken = googlePlusLoginResponse?.idToken;
      const accessToken = googlePlusLoginResponse?.accessToken;

      // firebase sign in
      if (idToken && accessToken) {
        await this.firebaseAuthentication.signInWithGoogle(idToken, accessToken);
      } else {
        const error = 'idToken or accessToken missing ';
        this.logger.error(error, idToken, accessToken);
        return Promise.reject(error);
      }

      // wantic sign in 
      const wanticSignInResponse = await this.wanticSignIn();
      return Promise.resolve({ googlePlusLoginResponse: googlePlusLoginResponse, user: wanticSignInResponse.user });
    } catch (error) {
      this.logger.error(error);
      let errorMessage = 'Deine Anmeldung ist fehlgeschlagen';
      if (typeof error === 'string' && error === 'The user canceled the sign-in flow.') {
        errorMessage = null;
      } else {
        errorMessage = this.getFirebaseAuthErrorMessage(error);
      }
      return Promise.reject(errorMessage);
    }
  }

  private async getSignInOptions() {
    let signInOptions = {};
    const deviceInfo = await Device.getInfo();
    if (deviceInfo.platform === 'android') {
      signInOptions = {
        'webClientId': environment.googleSignInAndroidClientId
      };
    }
    return signInOptions;
  }

  async appleSignIn(): Promise<{appleSignInResponse: AppleSignInResponse, user: UserProfile}> {
    try {
      // apple sign in
      const appleSignInResponse = await this.signInWithApple.signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
        ]
      });

      // firebase sign in
      await this.firebaseAuthentication.signInWithApple(appleSignInResponse.identityToken);

      // wantic sign in
      const wanticSignInResponse = await this.wanticSignIn();
      return Promise.resolve({ appleSignInResponse: appleSignInResponse, user: wanticSignInResponse.user });
    } catch (error) {
      this.logger.error(error);
      let errorMessage = 'Deine Anmeldung ist fehlgeschlagen';
      if (typeof error === 'object' && error?.code === '1001' && error?.error === 'ASAUTHORIZATION_ERROR') {
        errorMessage = null;
      } else {
        errorMessage = this.getFirebaseAuthErrorMessage(error);
      }
      return Promise.reject(errorMessage);
    }
  }

  async wanticSignIn(): Promise<SignInResponse> {
    const userInfo = this.userInfo.value;
    if (userInfo?.uid && userInfo?.email) {
      const signInRequestBody = { uid: userInfo.uid, email: userInfo.email };
      try {
        const signInResponse = await this.authApiService.signInWithThirdPartyAuthProvider(signInRequestBody).toPromise();
        return Promise.resolve(signInResponse);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    const error = 'email or uid missing ';
    this.logger.error(error, userInfo);
    return Promise.reject(error);
  }

  async getFirebaseIdToken(forceRefresh: boolean = false): Promise<string> {
    try {
      const idToken = await this.firebaseAuthentication.getIdToken(forceRefresh);
      await this.updateToken(idToken);
      return Promise.resolve(idToken);
    } catch (error) {
      this.logger.error('failed to refresh firebase id token', error);
      if (this.isAuthenticated.value === null) {
        this.isAuthenticated.next(false);
      }
      return Promise.reject(error);
    }
  }

  private async updateToken(token: string): Promise<void> {
    if (!token) {
      this.isAuthenticated.next(false);
      return Promise.reject('token to upate is invalid'); 
    }
    await this.storageService.set(StorageKeys.FIREBASE_ID_TOKEN, token, true);
    this.updateAuthorizationHeaderForNativeHttpClient(token);
    this.isAuthenticated.next(true);
    return Promise.resolve();
  }

  private getFirebaseAuthErrorMessage(error: any): string {
    let errorMessage = 'Deine Anmeldung ist fehlgeschlagen';
    if (error === 'User cancelled.') {
      errorMessage = null;
    }
    return errorMessage;
  }

  sendVerificationMail(): Promise<any> {
    return this.firebaseAuthentication.sendEmailVerification();
  }

  resetPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authApiService.resetPassword(email).toPromise().then(() => {
        this.firebaseAuthentication.sendPasswordResetEmail(email).then(resolve, reject);
      }, reject)
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

  async migrateSavedCredentials(): Promise<{email: string, password: string}> {
    try {
        const email = await this.storageService.get<string>(StorageKeys.LOGIN_EMAIL, true);
        const password = await this.storageService.get<string>(StorageKeys.LOGIN_PASSWORD, true);
        let credentials = null;
        if (email && password) {
          credentials = {email: email, password: password};
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

enum FirebaseAuthErrorCode {
  emailAlreadyInUse = 'auth/email-already-in-use',
  invalidEmail = 'auth/invalid-email',
  operationNotAllowed = 'auth/operation-not-allowed',
  weakPassword = 'auth/weak-password',
  userDisabled = 'auth/user-disabled',
  userNotFound = 'auth/user-not-found',
  wrongPassword = 'auth/wrong-password'
}
