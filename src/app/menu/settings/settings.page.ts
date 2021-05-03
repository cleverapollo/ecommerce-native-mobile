import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { first } from 'rxjs/operators';
import { UserProfileStore } from './user-profile-store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  profile: UserProfile

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
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('profile_settings');
    this.profile = this.route.snapshot.data.profile;
  }

  ngOnDestroy() {}

  ionViewWillEnter() {
    this.userProfileStore.loadUserProfile(false).pipe(first()).subscribe(profile => {
      this.profile = profile;
    })
  }

  forceRefresh(event) {
    this.userProfileStore.loadUserProfile(true).pipe(first()).subscribe({
      next: profile => {
        this.profile = profile;
        event.target.complete();
      },
      error: error => {
        event.target.complete();
      }
    });
  }

}
