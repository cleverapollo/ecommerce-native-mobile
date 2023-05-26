import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CustomError, CustomErrorType } from '@core/error';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { APP_URL, environment } from '@env/environment';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import {
  FirebaseDynamicLinks,
  LinkConfig
} from '@pantrist/capacitor-firebase-dynamic-links';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Logger } from './log.service';
import { PlatformService } from './platform.service';

export interface FirebaseControllable {
  getIdToken(forceRefresh: boolean): Promise<string | null>
  onAuthStateChanged(): Observable<any | firebase.User>
  sendEmailVerification(): Promise<any>;
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
    private platform: PlatformService,
    private nativeAuth: FirebaseAuthentication,
    private angularAuth: AngularFireAuth,
    private logger: Logger
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

  async getIdToken(forceRefresh: boolean): Promise<string | null> {
    if (this.platform.isNativePlatform) {
      return this.nativeAuth.getIdToken(forceRefresh);
    } else {
      const authState = await this.getAuthState();
      return await authState?.getIdToken(forceRefresh) ?? null;
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

  // Firebase Dynamic Links

  async createShortLinkForCreatorAccount(creator: ContentCreatorAccount): Promise<string> {
    const config: LinkConfig = {
      domainUriPrefix: 'https://wantic.page.link',
      uri: `${APP_URL}/creator/${creator.userName}`,
      androidParameters: {
        packageName: environment.android.packageName,
        fallbackUrl: 'https://wantic.io',
        minimumVersion: 202303251 // ToDo
      },
      iosParameters: {
        bundleId: environment.ios.bundleId,
        appStoreId: environment.ios.appStoreId,
        fallbackUrl: 'https://wantic.io',
        minimumVersion: '1.6.0'
      },
      socialMeta: {
        title: `Wantic Creator - @${creator.userName}`,
        description: 'A Creator from wantic',
        imageUrl: 'https://app.beta.wantic.io/assets/icon/wantic-logo.svg'
      },
      webApiKey: environment.firebaseConfig.apiKey
    }
    return (await FirebaseDynamicLinks.createDynamicShortLink(config)).value;
  }

  listenToDeepLinkOpen() {
    FirebaseDynamicLinks.addListener('deepLinkOpen', (data) => {
      this.logger.info(`Open deep link ${data.url}`);
    });
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