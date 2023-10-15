import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignInResult } from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
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
      await this.signIn(signInResponse.appleSignInResponse, signInResponse.user, AuthProvider.APPLE);
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Die Anmeldung ist fehlgeschlagen!');
    }
  }

  async signupWithFacebook() {
    try {
      const signInResponse = await this.authService.facebookSignIn();
      await this.signIn(signInResponse.facebookLoginResponse, signInResponse.user, AuthProvider.FACEBOOK);
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Die Anmeldung ist fehlgeschlagen!');
    }
  }

  async signupWithGoogle() {
    try {
      const signInResponse = await this.authService.googlePlusSignIn();
      await this.signIn(signInResponse.googlePlusLoginResponse, signInResponse.user, AuthProvider.GOOGLE);
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Die Anmeldung ist fehlgeschlagen!');
    }
  }

  private async signIn(signInResponse: SignInResult, userProfile: UserProfile, authProvider: AuthProvider) {
    if (!signInResponse.user) { return; }

    await this.loadingService.showLoadingSpinner();

    const displayNameParts = signInResponse.user.displayName.split(' ');
    const firstName = displayNameParts.length >= 1 ? displayNameParts[0] : null;
    const lastName = displayNameParts.length >= 2 ? displayNameParts[1] : null;

    await this.authService.setupFirebaseIdToken(true);
    await this.updateFirstNameIfNeeded(firstName, userProfile);
    await this.updateLastNameIfNeeded(lastName, userProfile);

    this.analyticsService.logLoginEvent(authProvider);
    await this.router.navigateByUrl('secure/home/wish-list-overview', { replaceUrl: true });
    return this.loadingService.stopLoadingSpinner();
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
