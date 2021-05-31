import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService, StorageKeys } from './storage.service';
import { CacheService } from 'ionic-cache';
import { HTTP } from '@ionic-native/http/ngx';
import { LogService } from './log.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ToastService } from './toast.service';
import { AuthService } from '@core/api/auth.service';
import { AuthProvider, SignInResponse, SignupRequest, SignupRequestSocialLogin } from '@core/models/signup.model';
import { first } from 'rxjs/operators';
import { AppleSignInResponse, ASAuthorizationAppleIDRequest, SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { UserProfile } from '@core/models/user.model';
import { SERVER_URL } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated = new BehaviorSubject<boolean>(null);
  isEmailVerified = new BehaviorSubject<boolean>(null);
  firebaseAccessToken = new BehaviorSubject<string>(null);
  userInfo = new BehaviorSubject<any>(null);

  constructor(
    private storageService: StorageService, 
    private platform: Platform,
    private cache: CacheService,
    private nativeHttpClient: HTTP,
    private logger: LogService,
    private toastService: ToastService,
    private firebaseAuthentication: FirebaseAuthentication,
    private authApiService: AuthService,
    private facebook: Facebook,
    private googlePlus: GooglePlus,
    private signInWithApple: SignInWithApple,
  ) { 
    if (this.platform.is('capacitor')) {
      this.configFirebaseAuthentication();
      this.refreshFirebaseIdToken(false);
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
          this.isEmailVerified.next(isEmailVerified);
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
      this.firebaseAccessToken.next(null);
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
      await this.refreshFirebaseIdToken(true);
      await this.storageService.set(StorageKeys.CREDENTIALS, { email: email, password: password }, true);

      return Promise.resolve(signInResponse);
    } catch (error) {
      this.handleFirebaseAuthErrors(error);
      return Promise.reject(error);
    }
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
      this.handleFirebaseAuthErrors(error);
      this.logger.error(error, typeof error);
      return Promise.reject(error);
    }
  }

  async googlePlusSignIn(): Promise<{googlePlusLoginResponse: any, user: UserProfile}> {
    try {
      // google plus sign in
      const googlePlusLoginResponse = await this.googlePlus.login({});
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
      this.handleFirebaseAuthErrors(error);
      this.logger.error(error);
      return Promise.reject(error);
    }
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
      this.handleFirebaseAuthErrors(error);
      this.logger.error(error);
      return Promise.reject(error);
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

  async refreshFirebaseIdToken(forceRefresh: boolean): Promise<string> {
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
    this.firebaseAccessToken.next(token);
    this.isAuthenticated.next(true);
    return Promise.resolve();
  }

  private handleFirebaseAuthErrors(error: any) {
    if (error.message && error.code) {
      const errorMessage = this.getErrorMessageForFirebaseErrorCode(error.message, error.code);
      this.toastService.presentErrorToast(errorMessage);
    }
  }

  private getErrorMessageForFirebaseErrorCode(firebaseErrorMessage: string, errorCode: FirebaseAuthErrorCode): string {
    let errorMessage: string = firebaseErrorMessage;
    switch (errorCode) {
      case FirebaseAuthErrorCode.userDisabled:
        errorMessage = 'Dein Account ist deaktiviert.';
        break;
      case FirebaseAuthErrorCode.invalidEmail:
        errorMessage = 'Deine E-Mail-Adresse scheint nicht richtig zu sein. Bitte überprüfe, ob du diese auch richtig eingegeben hast.';
        break;
      case FirebaseAuthErrorCode.userNotFound:
        errorMessage = 'Der Benutzer mit der angegebenen E-Mail-Adresse wurde nicht gefunden';
        break;
      case FirebaseAuthErrorCode.wrongPassword:
        errorMessage = 'Du hast dein Passwort falsch eingegeben.';
        break;
      case FirebaseAuthErrorCode.emailAlreadyInUse:
        errorMessage = 'Ein Account mit der eingegebenen E-Mail-Adresse existiert bereits.';
        break;
      case FirebaseAuthErrorCode.weakPassword:
        errorMessage = 'Dein Passwort ist zu schwach, es sollte min. aus 6 Zeichen bestehen.';
        break;
      default:
        errorMessage = 'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später noch einmal.';
        break;
    }
    return errorMessage;
  }

  sendVerificationMail(): Promise<any> {
    return this.firebaseAuthentication.sendEmailVerification();
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
