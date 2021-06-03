import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';

@Component({
  selector: 'app-email-unverified-hint',
  templateUrl: './email-unverified-hint.component.html',
  styleUrls: ['./email-unverified-hint.component.scss'],
})
export class EmailUnverifiedHintComponent implements OnInit {

  emailVerified: Boolean;
  disableButton = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.isEmailVerified.subscribe({
      next: isEmailVerified => { 
        this.emailVerified = isEmailVerified; 
      }
    })
  }

  resendVerificationLink() {
    this.disableButton = true;
    this.authService.sendVerificationMail().finally(() => {
      this.disableButton = false;
    })
  }

}
