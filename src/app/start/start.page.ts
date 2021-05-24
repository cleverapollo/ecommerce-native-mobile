import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { LogService } from '@core/services/log.service';
import { Plugins } from '@capacitor/core'
import { AuthenticationService } from '@core/services/authentication.service';
import { NavController } from '@ionic/angular';
import { AuthProvider, SignupRequestSocialLogin } from '@core/models/signup.model';
import { UserApiService } from '@core/api/user-api.service';
import { first } from 'rxjs/operators';
import { AuthService } from '@core/api/auth.service';
import { AppleSignInResponse } from '@ionic-native/sign-in-with-apple/ngx';
import { UserProfile } from '/Users/fischeti/Documents/develop/wantic-frontend/src/app/core/models/user.model';

const { Device } = Plugins

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  showAppleSignIn = false;
  
  constructor(
    private analyticsService: AnalyticsService, 
    private logger: LogService,
    private router: Router,
    private userApiService: UserApiService,
    private authService: AuthenticationService,
    private authApiService: AuthService,
    public privacyPolicyService: PrivacyPolicyService
  ) { 
    this.analyticsService.setFirebaseScreenName('logon');
  }

  async ngOnInit() {
    const deviceInfo = await Device.getInfo();
    this.showAppleSignIn = deviceInfo.platform === 'ios';
  }

  signupWithMailAndPassword() {
    this.router.navigateByUrl('/login');
  }

  async signupWithApple() {
    const signInResponse = await this.authService.appleSignIn();
    const userIsRegistered = signInResponse.user !== null;
    this.logger.debug('signInResponse', signInResponse);
    
    if (userIsRegistered) {
      await this.authService.refreshFirebaseIdToken(true);
      await this.updateFirstNameIfNeeded(signInResponse);
      await this.updateLastNameIfNeeded(signInResponse);
      this.router.navigateByUrl('/secure/home/wish-list-overview', { replaceUrl: true });
    } else {
      const signupRequest = this.createSignUpRequestSocialLogin(signInResponse.appleSignInResponse);
      if (signupRequest) {
        await this.authApiService.signupSocialLogin(signupRequest).toPromise();
        await this.authService.sendVerificationMail();
        this.router.navigateByUrl('signup/signup-completed');
      }
    }
  }

  private updateLastNameIfNeeded(signInResponse: { appleSignInResponse: AppleSignInResponse; user: UserProfile; }): Promise<void> {
    if (signInResponse.user?.lastName === '') {
      return new Promise((resolve) => {
        const lastName = signInResponse.appleSignInResponse?.fullName?.familyName;
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

  private updateFirstNameIfNeeded(signInResponse: { appleSignInResponse: AppleSignInResponse; user: UserProfile; }): Promise<void> {
    if (signInResponse.user?.firstName === '') {
      return new Promise((resolve) => {
        const firstName = signInResponse.appleSignInResponse?.fullName?.givenName;
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

  private createSignUpRequestSocialLogin(appleSignInResponse: AppleSignInResponse): SignupRequestSocialLogin {
    const uid = this.authService.userInfo.value.uid;
    if (uid == null) {
      this.logger.error('no uid found in user info', this.authService.userInfo.value);
      return null;
    }

    const email = this.authService.userInfo.value.email;
    if (!email) {
      this.logger.error('no email found in appleSignInResponse', appleSignInResponse);
      return null;
    }

    return {
      uid: uid,
      email: email,
      firstName: appleSignInResponse?.fullName?.givenName,
      lastName: appleSignInResponse?.fullName?.familyName,
      agreedToPrivacyPolicyAt: new Date(),
      authProvider: AuthProvider.apple,
    };
  }

  signupWithFacebook() {

  }

  signupWithGoogle() {

  }

}
