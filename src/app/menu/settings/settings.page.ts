import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthProvider } from '@core/models/signup.model';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { Subscription } from 'rxjs';
import { UserProfileStore } from './user-profile-store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  private loadUserProfileSubscription: Subscription;
  private forceLoadUserProfileSubscription: Subscription;

  profile: UserProfile;
  showPasswordChangeLink: boolean;
  userCanChangeEmail: boolean;
  isCreatorAccountActive: boolean = false;

  get title(): string {
    return this.isCreatorAccountActive ?
      'Creator Profil bearbeiten' :
      'Profil bearbeiten';
  }

  get dataForChildRoutes() {
    return {
      data: {
        profile: this.profile
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private userProfileStore: UserProfileStore,
    private analyticsService: AnalyticsService,
    private logger: Logger
  ) { }

  async ngOnInit() {
    this.profile = this.route.snapshot?.data?.profile
    this.showPasswordChangeLink = this.profile.authProvider === AuthProvider.WANTIC;
    this.userCanChangeEmail = this.profile.authProvider === AuthProvider.WANTIC;
    this.isCreatorAccountActive = this.userProfileStore.isCreatorAccountActive$.value;
  }

  ionViewWillEnter() {
    this.loadUserProfileSubscription = this.userProfileStore.loadUserProfile(false).subscribe(profile => {
      this.profile = profile;
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings');
  }

  ngOnDestroy() {
    this.loadUserProfileSubscription.unsubscribe();
    this.forceLoadUserProfileSubscription?.unsubscribe();
  }

  forceRefresh(event) {
    this.forceLoadUserProfileSubscription = this.userProfileStore.loadUserProfile(true).subscribe({
      next: profile => {
        this.profile = profile;
        event.target.complete();
      },
      error: error => {
        this.logger.error(error);
        event.target.complete();
      }
    });
  }

}
