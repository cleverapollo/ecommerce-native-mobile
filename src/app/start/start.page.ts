import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignInResult } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthService } from '@core/api/auth.service';
import { UserApiService } from '@core/api/user-api.service';
import { AuthProvider } from '@core/models/signup.model';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { CoreToastService } from '@core/services/toast.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage {

  get showAppleSignIn(): boolean {
    return this.platformService.isIOS;
  }
  get showFacebookSignIn(): boolean {
    return Capacitor.isNativePlatform();
  }
  get showGooglePlusSignIn(): boolean {
    return Capacitor.isNativePlatform();
  }

  constructor(
    private logger: Logger,
    private analyticsService: AnalyticsService,
    private router: Router,
    private userApiService: UserApiService,
    private authService: AuthenticationService,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private platformService: PlatformService,
    private authApiService: AuthService,
    public privacyPolicyService: PrivacyPolicyService
  ) { }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('logon');
    SplashScreen.hide({
      fadeOutDuration: 500
    });
  }

  signupWithMailAndPassword() {
    this.router.navigateByUrl('/login');
  }

  async signupWithApple() {
    try {
      await this.loadingService.showLoadingSpinner();
      const signInResponse = await this.authService.appleSignIn();
      await this.signIn(signInResponse.appleSignInResponse, signInResponse.user, AuthProvider.APPLE);
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Die Anmeldung ist fehlgeschlagen!');
    } finally {
      this.loadingService.stopLoadingSpinner();
    }
  }

  async signupWithFacebook() {
    try {
      await this.loadingService.showLoadingSpinner();
      const signInResponse = await this.authService.facebookSignIn();
      await this.signIn(signInResponse.facebookLoginResponse, signInResponse.user, AuthProvider.FACEBOOK);
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Die Anmeldung ist fehlgeschlagen!');
    } finally {
      this.loadingService.stopLoadingSpinner();
    }
  }

  async signupWithGoogle() {
    try {
      await this.loadingService.showLoadingSpinner();
      const signInResponse = await this.authService.googlePlusSignIn();
      await this.signIn(signInResponse.googlePlusLoginResponse, signInResponse.user, AuthProvider.GOOGLE);
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Die Anmeldung ist fehlgeschlagen!');
    } finally {
      this.loadingService.stopLoadingSpinner();
    }
  }

  private async signIn(signInResult: SignInResult, userProfile: UserProfile, authProvider: AuthProvider): Promise<void> {
    const userIsRegistered = userProfile !== null;
    const displayNameParts = signInResult?.user?.displayName?.split(' ');
    const firstName = displayNameParts?.length >= 1 ? displayNameParts[0] : '';
    const lastName = displayNameParts?.length >= 2 ? displayNameParts[1] : '';

    if (userIsRegistered) {
      await this.authService.setupFirebaseIdToken(true);
      await this.updateFirstNameIfNeeded(firstName, userProfile);
      await this.updateLastNameIfNeeded(lastName, userProfile);
      this.analyticsService.logLoginEvent(authProvider);
      await this.router.navigateByUrl('secure/home/wish-list-overview', { replaceUrl: true });
    } else {
      await this.signUp(signInResult, firstName, lastName, authProvider);
    }
  }

  private async signUp(signInResult: SignInResult, firstName: string, lastName: string, authProvider: AuthProvider): Promise<void> {
    if (!signInResult?.user?.email) {
      throw new Error('Email is required');
    }
    if (!signInResult?.user?.uid) {
      throw new Error('Id is required');
    }

    await this.authApiService.signupSocialLogin({
      uid: signInResult.user.uid,
      email: signInResult.user.email,
      firstName,
      lastName,
      agreedToPrivacyPolicyAt: new Date(),
      authProvider
    }).toPromise();
    await this.authService.setupFirebaseIdToken(true);
    this.analyticsService.logCompleteRegistrationEvent(authProvider);
    if (signInResult?.user?.emailVerified === false) {
      await this.authService.sendVerificationMail();
    }
    await this.router.navigateByUrl('signup/signup-mail-two');
  }

  private async updateLastNameIfNeeded(lastName: string, user: UserProfile): Promise<void> {
    if (!user?.lastName && lastName) {
      await lastValueFrom(this.userApiService.partialUpdateLastName(lastName));
    }
  }

  private async updateFirstNameIfNeeded(firstName: string, user: UserProfile): Promise<void> {
    if (!user?.firstName && firstName) {
      await lastValueFrom(this.userApiService.partialUpdateFirstName(firstName));
    }
  }
}
