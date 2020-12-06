import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '@core/models/user.model';
import { LogService } from '@core/services/log.service';
import { UserProfileStore } from './user-profile-store.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  refreshData: boolean = false;
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
    private logger: LogService
  ) { }

  ngOnInit() {
    this.profile = this.route.snapshot.data.profile;
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
    this.userProfileStore.loadUserProfile(true).subscribe(profile => {
      this.profile = profile;
    }, this.logger.error, () => {
      event.target.complete();
    })
  }

}
