import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicEmailVerificationStatus } from '@core/models/user.model';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
})
export class EmailVerificationPage implements OnInit {

  emailVerificationStatus: PublicEmailVerificationStatus;

  get verified() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.VERIFIED;
  }

  get tokenExpired() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.TOKEN_EXPIRED;
  }

  get error() {
    return this.emailVerificationStatus === PublicEmailVerificationStatus.ERROR;
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.emailVerificationStatus = this.route.snapshot.data.emailVerificationStatus;
  }

}
