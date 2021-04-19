import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('logon');
  }

}
