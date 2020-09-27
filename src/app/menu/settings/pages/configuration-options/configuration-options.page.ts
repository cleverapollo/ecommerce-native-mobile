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
  
  profile: UserProfile
  get dataForChildRoutes() {
    return {
      data: {
        profile: this.profile
      }
    }
  }

  constructor(private route: ActivatedRoute, private userProfileDataServer: UserProfileDataService) { }

  ngOnInit() {
    this.initProfileIfNeeded()
  }

  initProfileIfNeeded() {
    this.userProfileDataServer.userProfile$.subscribe( userProfile => {
      if (!this.profile) {
        this.profile = this.route.snapshot.data.profile;
      } else if (this.profile && userProfile) {
        this.profile = userProfile;
      }
    })
  }
}
