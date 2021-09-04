import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthProvider } from '@core/models/signup.model';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LogService } from '@core/services/log.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserProfileStore } from './user-profile-store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  private loadUserProfileSubscription: Subscription;

  profile: UserProfile;
  showPasswordChangeLink: boolean;
  userCanChangeEmail: boolean;

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
    private logger: LogService
  ) { }

  async ngOnInit() {
    this.profile = this.route.snapshot?.data?.profile 
    this.showPasswordChangeLink = this.profile.authProvider === AuthProvider.WANTIC;
    this.userCanChangeEmail = this.profile.authProvider === AuthProvider.WANTIC;
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
  }

  forceRefresh(event) {
    this.userProfileStore.loadUserProfile(true).pipe(first()).subscribe({
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
