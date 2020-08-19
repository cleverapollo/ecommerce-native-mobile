import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserProfileDataService } from './user-profile-data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  profile: UserProfile

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
