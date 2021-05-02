import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(
    private analyticsService: AnalyticsService, 
    private router: Router,
    public privacyPolicyService: PrivacyPolicyService
  ) { 
    this.analyticsService.setFirebaseScreenName('logon');
  }

  ngOnInit() {
  }

  signupWithMailAndPassword() {
    this.router.navigateByUrl('/signup/signup-mail');
  }

  signupWithApple() {

  }

  signupWithFacebook() {

  }

  signupWithGoogle() {

  }

}
