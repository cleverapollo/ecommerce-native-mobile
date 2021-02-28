import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '@core/models/user.model';
import { LogService } from '@core/services/log.service';
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

  refreshData: boolean = false;
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
    private logger: LogService,
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
    if (this.refreshData) {
      this.userProfileStore.loadUserProfile(false).subscribe(profile => {
        this.profile = profile;
      })
    }
  }

  ionViewDidLeave() {
    this.refreshData = true;
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
