import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthService } from '@core/api/auth.service';
import { UserApiService } from '@core/api/user-api.service';
import { AuthProvider, SignInResponse, SignupRequestSocialLogin } from '@core/models/signup.model';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';
import { first } from 'rxjs/operators';

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
    return this.platformService.isIOS || this.platformService.isAndroid;
  }
  get showGooglePlusSignIn(): boolean {
    return this.platformService.isIOS || this.platformService.isAndroid;
  }

  constructor(
    private analyticsService: AnalyticsService,
    private logger: Logger,
    private router: Router,
    private userApiService: UserApiService,
    private authService: AuthenticationService,
    private authApiService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private platformService: PlatformService,
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
      const signInResponse = await this.authService.appleSignIn();
      const firstName = signInResponse?.appleSignInResponse?.fullName?.givenName ?? '';
      const lastName = signInResponse?.appleSignInResponse?.fullName?.familyName;
      this.signIn(signInResponse, firstName, lastName, AuthProvider.APPLE);
    } catch (error) {
      if (typeof error === 'string') {
        this.toastService.presentErrorToast(error);
      }
    }
  }

  async signupWithFacebook() {
    try {
      const signInResponse = await this.authService.facebookSignIn();
      const facebookUserProfile = await this.userService.facebookUserProfile;
      const firstName = facebookUserProfile?.firstName ?? '';
      const lastName = facebookUserProfile?.lastName;
      this.signIn(signInResponse, firstName, lastName, AuthProvider.FACEBOOK);
    } catch (error) {
      if (typeof error === 'string') {
        this.toastService.presentErrorToast(error);
      }
    }
  }

  async signupWithGoogle() {
    try {
      const signInResponse = await this.authService.googlePlusSignIn();
      const firstName = signInResponse?.googlePlusLoginResponse?.givenName ?? '';
      const lastName = signInResponse?.googlePlusLoginResponse?.familyName;
      this.signIn(signInResponse, firstName, lastName, AuthProvider.GOOGLE);
    } catch (error) {
      if (typeof error === 'string') {
        this.toastService.presentErrorToast(error);
      }
    }
  }

  private async signIn(signInResponse: SignInResponse, firstName: string, lastName: string, authProvider: AuthProvider) {
    await this.loadingService.showLoadingSpinner();

    const userIsRegistered = signInResponse.user !== null;
    if (userIsRegistered) {
      await this.authService.setupFirebaseIdToken(true);
      await this.updateFirstNameIfNeeded(firstName, signInResponse.user);
      await this.updateLastNameIfNeeded(lastName, signInResponse.user);
      this.analyticsService.logLoginEvent(authProvider);
      this.router.navigateByUrl('secure/home/wish-list-overview', { replaceUrl: true });
    } else {
      const signupRequest = this.createSignUpRequestSocialLogin(firstName, lastName, authProvider);
      if (signupRequest) {
        await this.authApiService.signupSocialLogin(signupRequest).toPromise();
        await this.authService.setupFirebaseIdToken(true);
        this.analyticsService.logCompleteRegistrationEvent(authProvider);
        if (this.authService.isEmailVerified.value === false) {
          await this.authService.sendVerificationMail();
        }
        this.router.navigateByUrl('signup/signup-mail-two');
      }
    }

    this.loadingService.stopLoadingSpinner();
  }

  // helper methods

  private createSignUpRequestSocialLogin(firstName: string, lastName: string, authProvider: AuthProvider): SignupRequestSocialLogin {
    const uid = this.authService.userInfo.value.uid;
    if (uid == null) {
      this.logger.error('no uid found in user info', this.authService.userInfo.value);
      return null;
    }

    const email = this.authService.userInfo.value.email;
    if (!email) {
      this.logger.error('no email found in user info', this.authService.userInfo.value);
      return null;
    }

    return {
      uid,
      email,
      firstName,
      lastName,
      agreedToPrivacyPolicyAt: new Date(),
      authProvider,
    };
  }

  private updateLastNameIfNeeded(lastName: string, user: UserProfile): Promise<void> {
    if (!user?.lastName) {
      return new Promise((resolve) => {
        this.userApiService.partialUpdateLastName(lastName).pipe(first()).subscribe({
          next: u => {
            this.logger.debug('updated last name successful', u);
          },
          error: this.logger.error,
          complete: resolve
        })
      })
    } else {
      return Promise.resolve();
    }
  }

  private updateFirstNameIfNeeded(firstName: string, user: UserProfile): Promise<void> {
    if (user?.firstName === '') {
      return new Promise((resolve) => {
        this.userApiService.partialUpdateFirstName(firstName).pipe(first()).subscribe({
          next: u => {
            this.logger.debug('updated last name successful', u);
          },
          error: this.logger.error,
          complete: resolve
        })
      })
    } else {
      return Promise.resolve();
    }
  }

}
