import { Component, OnInit } from '@angular/core';
import { RegistrationApiService } from '../shared/api/registration-api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';
import { EmailVerificationResponse, EmailVerificationStatus } from '../shared/models/email-verification.model';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.page.html',
  styleUrls: ['./email-confirmation.page.scss'],
})
export class EmailConfirmationPage implements OnInit {

  emailVerificationResponse: EmailVerificationResponse;

  private get status() : EmailVerificationStatus {
    return this.emailVerificationResponse.status;
  }

  get email() : String {
    return this.emailVerificationResponse.email;
  }

  get success() : boolean {
    return this.status === EmailVerificationStatus.SUCCESS;
  }

  get notFound() : boolean {
    return this.status === EmailVerificationStatus.TOKEN_NOT_FOUND;
  }

  get error() : boolean {
    return this.status === EmailVerificationStatus.TECHNICAL_ERROR;
  }

  // expired 
  emailProcessStart: boolean = false;
  errorWhileSendingEmail: boolean = false;
  emailSentSuccessfully: boolean = false;

  get expired() : boolean {
    return this.expiredResendSuccessful || this.expiredResendFailed;
  }

  get expiredResendSuccessful() : boolean {
    return this.status === EmailVerificationStatus.TOKEN_EXPIRED_RESEND_SUCCESSFUL;
  }

  get expiredResendFailed() : boolean {
    return this.status === EmailVerificationStatus.TOKEN_EXPIRED_RESEND_FAILED;
  }

  constructor(
    private route: ActivatedRoute, 
    private registrationApiService: RegistrationApiService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.emailVerificationResponse = this.route.snapshot.data.emailVerificationResponse;
    console.log(this.emailVerificationResponse);
    this.updateJwToken();
  }

  private updateJwToken() {
    const token = this.emailVerificationResponse.jwToken;
    if (this.success && token) {
      this.authService.saveToken(token as string);
    }
  }

  requestEmailVerficiationLink() {
    this.emailProcessStart = true;
    this.registrationApiService.requestEmailVerificationLink().then(() => {
      this.emailSentSuccessfully = true;
    }, e => {
      console.error(e);
      this.errorWhileSendingEmail = true;
    });
  }

  get showResendButton() : boolean {
    return (this.expired || this.notFound) && !this.emailProcessStart
  }

}
