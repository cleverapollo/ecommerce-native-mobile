import { Component, OnInit, Input } from '@angular/core';
import { RegistrationApiService } from '../api/registration-api.service';

@Component({
  selector: 'app-email-unverified-hint',
  templateUrl: './email-unverified-hint.component.html',
  styleUrls: ['./email-unverified-hint.component.scss'],
})
export class EmailUnverifiedHintComponent implements OnInit {

  @Input() subText: string;

  requestIsRunning: boolean = false;

  private _emailSentSuccessfully: boolean = false;
  private _errorOccured: boolean = false;

  constructor(private registrationApiService: RegistrationApiService) { }

  ngOnInit() {
    console.log(this.subText);
  }

  get showButton() : boolean { 
    return !this.errorOccured && !this.success
  }

  resendVerificationLink() {
    this.requestIsRunning = true;
    this.registrationApiService.requestEmailVerificationLink().then(() => {
      this._emailSentSuccessfully = true;
    }, e => {
      this._errorOccured = true;
    }).finally(() => {
      this.requestIsRunning = false;
    });
  }

  get errorOccured() : boolean {
    return !this.requestIsRunning && this._errorOccured;
  }

  get success(): boolean {
    return !this.requestIsRunning && this._emailSentSuccessfully;
  }

}
