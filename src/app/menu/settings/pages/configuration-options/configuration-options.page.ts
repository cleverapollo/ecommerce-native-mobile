import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from '@core/models/user.model';
import { UserProfileDataService } from '../../user-profile-data.service';

@Component({
  selector: 'app-configuration-options',
  templateUrl: './configuration-options.page.html',
  styleUrls: ['./configuration-options.page.scss'],
})
export class ConfigurationOptionsPage implements OnInit {
  
  refreshData: boolean = false;
  profile: UserProfile
  
  get dataForChildRoutes() {
    return {
      data: {
        profile: this.profile
      }
    }
  }

  constructor(private route: ActivatedRoute, private userProfileStore: UserProfileDataService) { }

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
    }, console.error, () => {
      event.target.complete();
    })
  }

}
