import { Component, OnInit } from '@angular/core';
import { EmailVerificationStatus } from '@core/models/user.model';
import { RegistrationApiService } from '@core/api/registration-api.service';
import { UserService } from '@core/services/user.service';
import { EmailVerificationService } from '@core/services/email-verification.service';

@Component({
  selector: 'app-email-unverified-hint',
  templateUrl: './email-unverified-hint.component.html',
  styleUrls: ['./email-unverified-hint.component.scss'],
})
export class EmailUnverifiedHintComponent implements OnInit {

  private emailVerificationStatus: EmailVerificationStatus;

  disableButton = false;

  constructor(
    private registrationApiService: RegistrationApiService, 
    private emilVerificationService: EmailVerificationService) { }

  ngOnInit() {
    this.emilVerificationService.emailVerificationStatus.subscribe({
      next: emailVerificationStatus => { this.emailVerificationStatus = emailVerificationStatus }
    })
  }

  get showButton() : boolean { 
    return this.emailVerificationStatus === EmailVerificationStatus.UNVERIFIED;
  }

  get showHint(): boolean {
    return this.emailVerificationStatus !== EmailVerificationStatus.VERIFIED;
  }

  get subText(): String {
    switch(this.emailVerificationStatus) {
      case EmailVerificationStatus.UNVERIFIED:
        return 'Deine E-Mail-Adresse wurde noch nicht bestätigt. Deshalb kannst du den vollen Funktionsumfang von Wantic leider noch nicht nutzen.';
      case EmailVerificationStatus.VERIFICATION_EMAIL_SENT:
        return 'Wir haben dir eine E-Mail zum Bestätigen deiner E-Mail-Adresse gesendet. Folge bitte der Anleitung in der E-Mail.'
    }
    return null;
  }

  resendVerificationLink() {
    this.disableButton = true;
    this.registrationApiService.requestEmailVerificationLink().finally(() => {
      this.disableButton = false;
    })
  }

}
