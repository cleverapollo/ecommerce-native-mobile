import { Component } from '@angular/core';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-creator-account-info',
  templateUrl: './creator-account-info.page.html',
  styleUrls: ['./creator-account-info.page.scss'],
})
export class CreatorAccountInfoPage {

  constructor(private readonly analyticsService: AnalyticsService) { }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('creator_info');
  }

}
