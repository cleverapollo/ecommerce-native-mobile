import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { BrowserService } from '@core/services/browser.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { appVersion } from 'src/environments/environment';
import { UserProfileStore } from './settings/user-profile-store.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  firstName = 'Lädt';
  lastName = '...';
  creatorName = 'Lädt';
  displayFirstName = 'Lädt';
  displayLastName = 'Lädt';
  hasCreatorAccount = false;
  isCreatorAccountActive = false;

  get appVersion(): string {
    return appVersion
  }

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly browserService: BrowserService,
    private readonly analyticsService: AnalyticsService,
    private readonly userStore: UserProfileStore,
    private readonly storageService: StorageService,
    public readonly privacyPolicyService: PrivacyPolicyService
  ) { }

  ngOnInit(): void {
    this._initUserInfo();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('settings');
  }

  showFaqPage() {
    this.browserService.openInAppBrowser('https://www.wantic.io/faq');
  }

  logout() {
    this.authenticationService.logout().then(() => {
      this.router.navigate(['start'], { replaceUrl: true });
    })
  }

  switchAccount() {
    this.isCreatorAccountActive = !this.isCreatorAccountActive;
    this.storageService.set(StorageKeys.ACTIVE_CREATOR_ACCOUNT, this.isCreatorAccountActive);
    this.userStore.isCreatorAccountActive$.next(this.isCreatorAccountActive);
  }

  private async _initUserInfo() {
    const user = await this.userStore.loadUserProfile().toPromise();
    this.firstName = user.firstName;
    this.lastName = user.lastName || '';
    this.hasCreatorAccount = user.creatorAccount ? true : false;
    if (this.hasCreatorAccount) {
      this.creatorName = user.creatorAccount.name;
    }
    this.isCreatorAccountActive = this.userStore.isCreatorAccountActive$.value;
    this.displayFirstName = this.isCreatorAccountActive ? this.creatorName : this.firstName;
    this.displayLastName = this.isCreatorAccountActive ? null : this.lastName;
  }

}
