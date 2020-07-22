import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  profile: UserProfile

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.profile = this.route.snapshot.data.profile;
  }

}
