import { Component, OnInit, Input } from '@angular/core';
import { UserState } from '../../models/user.model';
import { RegistrationApiService } from '../../api/registration-api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-email-unverified-hint',
  templateUrl: './email-unverified-hint.component.html',
  styleUrls: ['./email-unverified-hint.component.scss'],
})
export class EmailUnverifiedHintComponent implements OnInit {

  @Input() subText: string;

  private requestIsRunning: boolean = false;
  private successResponse: boolean = false;
  private errorResponse: boolean = false;
  private userState: UserState;

  constructor(
    private registrationApiService: RegistrationApiService, 
    private userService: UserService) { }

  ngOnInit() {
    this.userService.userState.then( userState => {
      this.userState = userState;
    });
  }

  get showButton() : boolean { 
    return !this.errorOccured && !this.success
  }

  get showHint(): Boolean {
    return this.userState === UserState.UNVERIFIED;
  }

  get errorOccured() : boolean {
    return !this.requestIsRunning && this.errorResponse;
  }

  get success(): boolean {
    return !this.requestIsRunning && this.successResponse;
  }

  resendVerificationLink() {
    this.requestIsRunning = true;
    this.registrationApiService.requestEmailVerificationLink().then(() => {
      this.successResponse = true;
    }, e => {
      this.errorResponse = true;
    }).finally(() => {
      this.requestIsRunning = false;
    });
  }

}
