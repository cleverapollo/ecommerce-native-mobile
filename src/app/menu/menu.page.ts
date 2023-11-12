import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { BrowserService } from '@core/services/browser.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { appVersion } from 'src/environments/environment';
import { UserProfileStore } from './settings/user-profile-store.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit, OnDestroy {

  firstName = 'Lädt';
  lastName = '...';
  creatorName = 'Lädt';
  displayFirstName = 'Lädt';
  displayLastName = 'Lädt';
  hasCreatorAccount = false;
  isCreatorAccountActive = false;
  image: Blob | null = null;

  user?: UserProfile;

  get appVersion(): string {
    return appVersion
  }

  private subscriptions = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private browserService: BrowserService,
    private analyticsService: AnalyticsService,
    private userStore: UserProfileStore,
    private storageService: StorageService,
    public privacyPolicyService: PrivacyPolicyService
  ) { }

  ngOnInit() {
    this._listenToChanges();
    this.userStore.loadUserProfile().pipe(first()).subscribe();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('settings');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async showFaqPage() {
    await this.browserService.openInAppBrowser('https://www.wantic.io/faq');
  }

  async logout() {
    await this.authenticationService.logout();
    await this.router.navigate(['start'], { replaceUrl: true });
  }

  async switchAccount() {
    if (!this.hasCreatorAccount) {
      return;
    }
    this.isCreatorAccountActive = !this.isCreatorAccountActive;
    await this.storageService.set(StorageKeys.ACTIVE_CREATOR_ACCOUNT, this.isCreatorAccountActive);
    this.userStore.isCreatorAccountActive$.next(this.isCreatorAccountActive);
  }

  private async _listenToChanges(): Promise<void> {
    const user$ = this.userStore.user$.pipe(filter((user): user is UserProfile => !!user));
    const isCreatorAccountActive$ = this.userStore.isCreatorAccountActive$;
    this.subscriptions.add(combineLatest([user$, isCreatorAccountActive$]).pipe(
      map(result => ({ user: result[0], isCreatorAccountActive: result[1] }))
    ).subscribe({
      next: value => {
        this.user = value.user;
        this.isCreatorAccountActive = value.isCreatorAccountActive;
        this.firstName = this.user.firstName;
        this.lastName = this.user.lastName || '';
        this.hasCreatorAccount = !!this.user.creatorAccount;
        this.creatorName = this.user.creatorAccount?.name;
        this.displayFirstName = this.isCreatorAccountActive ? this.creatorName : this.firstName;
        this.displayLastName = this.isCreatorAccountActive ? null : this.lastName;

        this.isCreatorAccountActive ?
          this._updatePhoto(this.user.creatorAccount?.hasImage, this.userStore.downloadCreatorImage()) :
          this._updatePhoto(this.user?.hasImage, this.userStore.downloadUserImage());
      }
    }));
  }

  private _updatePhoto(hasImage: boolean, request: Observable<any>): void {
    if (hasImage) {
      this.subscriptions.add(request.subscribe({
        next: blob => this.image = blob
      }));
    } else {
      this.image = null;
    }
  }
}