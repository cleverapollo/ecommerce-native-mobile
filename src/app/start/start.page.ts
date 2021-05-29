import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { LogService } from '@core/services/log.service';
import { Plugins } from '@capacitor/core'
import { AuthenticationService } from '@core/services/authentication.service';
import { AuthProvider, SignInResponse, SignupRequestSocialLogin } from '@core/models/signup.model';
import { UserApiService } from '@core/api/user-api.service';
import { first } from 'rxjs/operators';
import { AuthService } from '@core/api/auth.service';
import { UserService } from '@core/services/user.service';
import { LoadingService } from '@core/services/loading.service';
import { UserProfile } from '@core/models/user.model';
import { AppsflyerEvent } from '@ionic-native/appsflyer/ngx';

const { Device } = Plugins

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  showAppleSignIn = false;
  showFacebookSignIn = false;
  showGooglePlusSignIn = false;
  
  constructor(
    private analyticsService: AnalyticsService, 
    private logger: LogService,
    private router: Router,
    private userApiService: UserApiService,
    private authService: AuthenticationService,
    private authApiService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    public privacyPolicyService: PrivacyPolicyService
  ) { 
    this.analyticsService.setFirebaseScreenName('logon');
  }

  async ngOnInit() {
    const deviceInfo = await Device.getInfo();
    this.showAppleSignIn = true; // deviceInfo.platform === 'ios';
    this.showFacebookSignIn = true;
    this.showGooglePlusSignIn = true; // deviceInfo.platform === 'ios' || deviceInfo.platform === 'android';
  }

  signupWithMailAndPassword() {
    this.router.navigateByUrl('/login');
  }

  async signupWithApple() {
    const signInResponse = await this.authService.appleSignIn();
    const firstName = signInResponse?.appleSignInResponse?.fullName?.givenName ?? '';
    const lastName = signInResponse?.appleSignInResponse?.fullName?.familyName;
    this.signIn(signInResponse, firstName, lastName, AuthProvider.apple);
  }

  async signupWithFacebook() {
    const signInResponse = await this.authService.facebookSignIn();
    const facebookUserProfile = await this.userService.facebookUserProfile;
    const firstName = facebookUserProfile?.firstName ?? '';
    const lastName = facebookUserProfile?.lastName;
    this.signIn(signInResponse, firstName, lastName, AuthProvider.facebook);
  }

  async signupWithGoogle() {
    const signInResponse = await this.authService.googlePlusSignIn();
    const firstName = signInResponse?.googlePlusLoginResponse?.givenName ?? '';
    const lastName = signInResponse?.googlePlusLoginResponse?.familyName;
    this.signIn(signInResponse, firstName, lastName, AuthProvider.google);
  }

  private async signIn(signInResponse: SignInResponse, firstName: string, lastName: string, authProvider: AuthProvider) {
    const spinner = await this.loadingService.createLoadingSpinner();
    await spinner.present();

    const userIsRegistered = signInResponse.user !== null;
    if (userIsRegistered) {
      await this.authService.refreshFirebaseIdToken(true);
      await this.updateFirstNameIfNeeded(firstName, signInResponse.user);
      await this.updateLastNameIfNeeded(lastName, signInResponse.user);
      this.analyticsService.logLoginEvent(authProvider);
      this.router.navigateByUrl('secure/home/wish-list-overview', { replaceUrl: true });
    } else {
      const signupRequest = this.createSignUpRequestSocialLogin(firstName, lastName, authProvider);
      if (signupRequest) {
        await this.authApiService.signupSocialLogin(signupRequest).toPromise();
        await this.authService.refreshFirebaseIdToken(true);
        this.analyticsService.logCompleteRegistrationEvent(authProvider);
        if (this.authService.isEmailVerified) {
          this.router.navigateByUrl('secure/home/wish-list-overview', { replaceUrl: true });
        } else {
          await this.authService.sendVerificationMail();
          this.router.navigateByUrl('signup/signup-mail-two');
        }
      }
    }

    this.loadingService.dismissLoadingSpinner(spinner);
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
      uid: uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      agreedToPrivacyPolicyAt: new Date(),
      authProvider: authProvider,
    };
  }

  private updateLastNameIfNeeded(lastName: string, user: UserProfile): Promise<void> {
    if (!user?.lastName) {
      return new Promise((resolve) => {
        this.userApiService.partialUpdateLastName(lastName).pipe(first()).subscribe({
          next: user => {
            this.logger.debug('updated last name successful', user);
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
          next: user => {
            this.logger.debug('updated last name successful', user);
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
