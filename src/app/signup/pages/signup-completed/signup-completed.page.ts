import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-signup-completed',
  templateUrl: './signup-completed.page.html',
  styleUrls: ['./signup-completed.page.scss'],
})
export class SignupCompletedPage {

  constructor(private router: Router, private analyticsService: AnalyticsService) { }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('signup-complete');
  }

  navToWishListOverview() {
    this.router.navigateByUrl('/secure/home', { replaceUrl: true });
  }

}
