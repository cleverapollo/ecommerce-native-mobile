import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicEmailVerificationStatus } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit {

  emailVerificationStatus: PublicEmailVerificationStatus;
  mailToString = "mailto:support@wantic.io?subject=Fehler%20bei%20der%20E-Mail%20Bestätigung"

  get verified() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.VERIFIED;
  }

  get tokenExpired() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.TOKEN_EXPIRED;
  }

  get error() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.ERROR;
  }

  constructor(private route: ActivatedRoute, private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('email_verification_result');
    this.emailVerificationStatus = this.route.snapshot.data.emailVerificationStatus;
  }

}
