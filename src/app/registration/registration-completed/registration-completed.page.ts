import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-registration-completed',
  templateUrl: './registration-completed.page.html',
  styleUrls: ['./registration-completed.page.scss'],
})
export class RegistrationCompletedPage implements OnInit {

  constructor(private router: Router, private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('guided_onboarding-complete');
  }

  navToWishListOverview() {
    this.router.navigateByUrl('/secure/home/wish-list-overview', { replaceUrl: true });
  }

}
