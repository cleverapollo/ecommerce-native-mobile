import { Component, OnInit } from '@angular/core';
import { RegistrationApiService } from '@core/api/registration-api.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { EmailVerificationResponse, EmailVerificationTokenStatus } from '@core/models/email-verification.model';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.page.html',
  styleUrls: ['./email-confirmation.page.scss'],
})
export class EmailConfirmationPage implements OnInit {

  emailVerificationResponse: EmailVerificationResponse;
  disableButton: boolean = false

  private get status() : EmailVerificationTokenStatus {
    return this.emailVerificationResponse.status;
  }

  get email() : String {
    return this.emailVerificationResponse.email;
  }

  get success() : boolean {
    return this.status === EmailVerificationTokenStatus.VALID;
  }

  get expired() : boolean {
    return this.status === EmailVerificationTokenStatus.TOKEN_EXPIRED;
  }

  get userIsAlreadyVerified() : boolean {
    return this.status === EmailVerificationTokenStatus.TOKEN_NOT_FOUND;
  }

  get error() : boolean {
    return this.status === EmailVerificationTokenStatus.TECHNICAL_ERROR;
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
    this.disableButton = true;
    this.registrationApiService.requestEmailVerificationLink().subscribe({
      complete: () => { this.disableButton = false; }
    });
  }

  get showResendButton() : boolean {
    return this.expired;
  }

  get showGotToStartpageButton(): boolean {
    return this.success || this.userIsAlreadyVerified;
  }

}
