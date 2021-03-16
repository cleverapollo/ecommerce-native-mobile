import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserProfileStore } from './user-profile-store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  private subscription: Subscription;

  profile: UserProfile
  accountIsNotActivated: boolean;

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
    private userService: UserService
  ) { }

  ngOnInit() {
    this.profile = this.route.snapshot.data.profile;
    this.subscription = this.userService.$accountIsEnabled.subscribe({
      next: accountIsEnabled => {
        this.accountIsNotActivated = !accountIsEnabled;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

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
