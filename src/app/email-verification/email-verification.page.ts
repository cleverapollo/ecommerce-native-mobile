import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyEmailResponse } from '@core/models/google-api.model';
import { PublicEmailVerificationStatus } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { Plugins } from '@capacitor/core'
const { Device } = Plugins

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit {

  emailVerificationStatus: PublicEmailVerificationStatus;
  mailToString = "mailto:support@wantic.io?subject=Fehler%20bei%20der%20E-Mail%20Bestätigung"
  showButton: boolean = false;

  get verified() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.VERIFIED;
  }

  get tokenExpired() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.TOKEN_EXPIRED;
  }

  get emailAlreadyConfirmed() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.EMAIL_ALREADY_CONFIRMED;
  }

  get error() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.ERROR;
  }

  constructor(
    private route: ActivatedRoute, 
    private analyticsService: AnalyticsService
  ) { }

  async ngOnInit() {
    this.emailVerificationStatus = this.route.snapshot.data.emailVerificationStatus;
    const deviceInfo = await Device.getInfo();
    this.showButton = deviceInfo.platform === 'android' || deviceInfo.platform === 'ios';
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('email_verification_result');
  }

}
