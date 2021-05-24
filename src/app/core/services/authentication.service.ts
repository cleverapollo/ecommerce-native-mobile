import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService, StorageKeys } from './storage.service';
import { CacheService } from 'ionic-cache';
import { HTTP } from '@ionic-native/http/ngx';
import { LogService } from './log.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ToastService } from './toast.service';
import { AuthService } from '@core/api/auth.service';
import { AuthProvider, SignupRequest, SignupRequestSocialLogin } from '@core/models/signup.model';
import { first } from 'rxjs/operators';
import { AppleSignInResponse, ASAuthorizationAppleIDRequest, SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfile } from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  token = new BehaviorSubject<string>(null);
  isAuthenticated = new BehaviorSubject<boolean>(null);
  userInfo = new BehaviorSubject<any>(null);

  get isEmailVerified(): boolean {
    const userInfo = this.userInfo.value;
    return userInfo.emailVerified !== false ? true : false;
  }

  constructor(
    private storageService: StorageService, 
    private platform: Platform,
    private cache: CacheService,
    private nativeHttpClient: HTTP,
    private logger: LogService,
    private toastService: ToastService,
    private firebaseAuthentication: FirebaseAuthentication,
    private authApiService: AuthService,
    private userApiService: UserApiService,
    private signInWithApple: SignInWithApple,
  ) { 
    if (this.platform.is('capacitor')) {
      this.configFirebaseAuthentication();
      this.loadToken();
      this.loadUserData();
    }
  }

  private configFirebaseAuthentication() {
    this.firebaseAuthentication.setLanguageCode('de-DE');
  }

  private loadToken() {
    this.storageService.get<string>(StorageKeys.FIREBASE_ID_TOKEN, true).then(idToken => {
      this.logger.debug('firebase idToken ', idToken);
      this.isAuthenticated.next(idToken ? true : false);
      this.updateAuthorizationHeaderForNativeHttpClient(idToken);
      this.token.next(idToken);
    }, error => {
      this.logger.error(error);
      this.isAuthenticated.next(false);
      this.removeAuthorizationHeaderForNativeHttpClient();
    });
  }

  private loadUserData() {
    this.firebaseAuthentication.onAuthStateChanged().subscribe(userInfo => {
      if (userInfo) {
        this.logger.info('user info', userInfo);
        this.storageService.set(StorageKeys.FIREBASE_USER_INFO, userInfo, true);
        this.userInfo.next(userInfo);
      } else {
        this.userInfo.next(null);
        this.storageService.set(StorageKeys.FIREBASE_USER_INFO, null, true);
      }
    })
  }

  async login(email: string, password: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.signInWithFirebaseEmailAndPassword(email, password).then(() => {
        this.saveCredentials(email, password);
        resolve();
      }, error => {
        this.logger.error(error);
        reject();
      })
    })
  }

  private saveCredentials(email: string, password: string) {
    this.storageService.set(StorageKeys.CREDENTIALS, { email: email, password: password }, true).then(() => {
      this.logger.debug('email and password saved sucessfully');
    }, this.logger.error);
  }

  async logout() {
    await this.storageService.clear();
    await this.cache.clearAll();
    this.removeAuthorizationHeaderForNativeHttpClient();
    this.isAuthenticated.next(false);
    await this.firebaseAuthentication.signOut();
    return Promise.resolve();
  }

  private updateAuthorizationHeaderForNativeHttpClient(token: string) {
    if (this.platform.is('capacitor') && token) {
      this.nativeHttpClient.setHeader('*', 'Authorization', `Bearer ${token}`);
    }
  }

  private removeAuthorizationHeaderForNativeHttpClient() {
    if (this.platform.is('capacitor')) {
      this.nativeHttpClient.setHeader('*', 'Authorization', null);
    }
  }

  // Firebase

  signupWithFirebaseEmailAndPassword(signupRequest: SignupRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.authApiService.signup(signupRequest).pipe(first()).subscribe(() => {
        this.signInWithFirebaseEmailAndPassword(signupRequest.email, signupRequest.password).then(() => {
          this.sendVerificationMail().then(resolve, reject);
        }, reject)
      }, error => {
        const errorMessage = 'Ein unbekannter Fehler ist aufgetreten. Bitte versuche es später noch einmal.';
        this.toastService.presentErrorToast(errorMessage);
        reject(error);
      })
    })
  }

  signInWithFirebaseEmailAndPassword(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => { 
      this.firebaseAuthentication.signInWithEmailAndPassword(email, password).then(() => {
        this.refreshFirebaseIdToken(true).then(() => { 
          resolve(); 
        }, reject);
      }, error => {
        this.logger.error(error);
        const errorMessage = this.getErrorMessageForFirebaseErrorCode(error.message, error.code);
        this.toastService.presentErrorToast(errorMessage);
        this.isAuthenticated.next(false);
        reject();
      })
    })
  }

  async appleSignIn(): Promise<{appleSignInResponse: AppleSignInResponse, user: UserProfile}> {
    try {
      const appleSignInResponse = await this.signInWithApple.signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
        ]
      });
      await this.firebaseAuthentication.signInWithApple(appleSignInResponse.identityToken);
      const userInfo = this.userInfo.value;
      if (userInfo?.uid && userInfo?.email) {
        const signInRequestBody = { uid: userInfo.uid, email: userInfo.email };
        const signInResponse = await this.authApiService.signin(signInRequestBody).toPromise();
        return Promise.resolve({ appleSignInResponse: appleSignInResponse, user: signInResponse.user });
      }
      this.logger.error('email or uid missing ', userInfo);
      return Promise.reject();
    } catch (error) {
      this.logger.error(error);
      return Promise.reject(error);
    }
  }

  async refreshFirebaseIdToken(forceRefresh: boolean): Promise<string> {
    try {
      const idToken = await this.firebaseAuthentication.getIdToken(forceRefresh);
      if (idToken) {
        await this.updateToken(idToken);
      }
      return Promise.resolve(idToken);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private updateToken(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storageService.set(StorageKeys.FIREBASE_ID_TOKEN, token, true).then(() => {
        this.logger.debug('updateToken');
        this.token.next(token);
        this.isAuthenticated.next(true);
        this.updateAuthorizationHeaderForNativeHttpClient(token);
        resolve();
      }, reject);
    })
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
