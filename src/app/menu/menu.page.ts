import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { BrowserService } from '@core/services/browser.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
  image: Blob | null = null;

  get appVersion(): string {
    return appVersion
  }

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private browserService: BrowserService,
    private analyticsService: AnalyticsService,
    private userStore: UserProfileStore,
    private storageService: StorageService,
    public privacyPolicyService: PrivacyPolicyService
  ) { }

  async ngOnInit(): Promise<void> {
    await this._initUserInfo();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('settings');
  }

  async showFaqPage() {
    await this.browserService.openInAppBrowser('https://www.wantic.io/faq');
  }

  async logout() {
    await this.authenticationService.logout();
    await this.router.navigate(['start'], { replaceUrl: true });
  }

  async switchAccount() {
    this.isCreatorAccountActive = !this.isCreatorAccountActive;
    await this.storageService.set(StorageKeys.ACTIVE_CREATOR_ACCOUNT, this.isCreatorAccountActive);
    this.userStore.isCreatorAccountActive$.next(this.isCreatorAccountActive);
  }

  private async _initUserInfo() {
    const user$ = this.userStore.loadUserProfile().pipe(filter((user): user is UserProfile => !!user));
    const isCreatorAccountActive$ = this.userStore.isCreatorAccountActive$;
    combineLatest([user$, isCreatorAccountActive$]).pipe(
      map(result => ({ user: result[0], isCreatorAccountActive: result[1] }))
    ).subscribe({
      next: value => {
        const user = value.user;
        this.isCreatorAccountActive = value.isCreatorAccountActive;
        this.firstName = user.firstName;
        this.lastName = user.lastName || '';
        if (user.creatorAccount) {
          this.hasCreatorAccount = true;
          this.creatorName = user.creatorAccount.name;
        }
        this.displayFirstName = this.isCreatorAccountActive ? this.creatorName : this.firstName;
        this.displayLastName = this.isCreatorAccountActive ? null : this.lastName;

        value.isCreatorAccountActive ?
          this._updatePhoto(user.creatorAccount.hasImage, this.userStore.downloadCreatorImage()) :
          this._updatePhoto(user.hasImage, this.userStore.downloadUserImage());
      }
    });
  }

  private _updatePhoto(hasImage: boolean, request: Observable<any>) {
    if (hasImage) {
      request.subscribe({
        next: blob => this.image = blob
      })
    } else {
      this.image = null;
    }
  }
}