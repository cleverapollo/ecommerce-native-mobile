import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/api/auth.service';
import { SignupRequest } from '@core/models/signup.model';
import { Gender } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { SignupStateService } from '../../signup-state.service';

@Component({
  selector: 'app-signup-mail-two',
  templateUrl: './signup-mail-two.page.html',
  styleUrls: ['./signup-mail-two.page.scss'],
})
export class SignupMailTwoPage implements OnInit, OnDestroy {

  birthday?: Date;
  gender?: Gender;
  agreedToPrivacyPolicyAt?: Date;

  form: FormGroup;
  validationMessages = {
    date: [
      { type: 'required', message: 'Gib bitte dein Geburtsdatum ein oder überspringe diesen Schritt.' }
    ],
    acceptPrivacyPolicy: [
      new ValidationMessage('required', 'Bitte der Datenschutzerklärung zustimmen.')
    ]
  }

  private signupStateSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private logger: LogService,
    private analyticsService: AnalyticsService,
    private signupStateService: SignupStateService,
    private loadingService: LoadingService,
    private authApiService: AuthService,
    private authService: AuthenticationService,
    public privacyPolicyService: PrivacyPolicyService
  ) { 
    this.analyticsService.setFirebaseScreenName('signup-mail-2');
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.signupStateSubscription.unsubscribe();
  }

  private createForm() {
    let value = '';
    if (this.birthday) {
      value = this.birthday.toDateString();
    }
    this.form = this.formBuilder.group({
      date: this.formBuilder.control(value, {
        updateOn: 'blur'
      }),
      acceptPrivacyPolicy: this.formBuilder.control(false, [Validators.requiredTrue])
    });
  }

  updateGender(event) {
    this.gender = event.target.value as Gender;
  }

  next() {
    if (this.form.valid) {
      this.agreedToPrivacyPolicyAt = new Date();
    } else {
      CustomValidation.validateFormGroup(this.form);
    }
  }

}
