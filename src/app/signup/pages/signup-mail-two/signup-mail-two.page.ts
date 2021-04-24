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
import { StorageKeys, StorageService } from '@core/services/storage.service';
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

  signupRequest: SignupRequest;
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
    private storageService: StorageService,
    public privacyPolicyService: PrivacyPolicyService
  ) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('signup-mail-2');
    this.signupStateSubscription = this.signupStateService.$signupRequest.subscribe(signupRequest => {
      this.signupRequest = signupRequest;
      this.createForm(signupRequest);
    }, errorReason => {
      this.logger.debug('failed to load signup request from cache. ', errorReason);
      this.createForm();
    });
  }

  ngOnDestroy(): void {
    this.signupStateSubscription.unsubscribe();
  }

  private createForm(signupRequest?: SignupRequest) {
    let value = '';
    if (signupRequest?.birthday) {
      value = signupRequest.birthday.toDateString();
    }
    this.form = this.formBuilder.group({
      date: this.formBuilder.control(value, {
        updateOn: 'blur'
      }),
      acceptPrivacyPolicy: this.formBuilder.control(false, [Validators.requiredTrue])
    });
  }

  updateGender(event) {
    this.signupRequest.gender = event.target.value as Gender;
  }

  async next() {
    if (this.form.valid) {
      this.signupRequest.agreedToPrivacyPolicyAt = new Date();
      this.signupStateService.updateState(this.signupRequest);
      const loadingSpinner = await this.loadingService.createLoadingSpinner();
      loadingSpinner.present();
      this.authApiService.signup(this.signupRequest).pipe(first()).subscribe({
        next: response => {
          this.authService.updateToken(response.jwToken.token).then(() => {
            this.storageService.set(StorageKeys.REGISTRATION_RESPONSE, response).then(() => {
              this.router.navigateByUrl('signup/signup-completed');
            });
          })
          this.loadingService.dismissLoadingSpinner(loadingSpinner);
        },
        error: error => {
          this.loadingService.dismissLoadingSpinner(loadingSpinner);
        }
      })
    } else {
      CustomValidation.validateFormGroup(this.form);
    }
  }

}
