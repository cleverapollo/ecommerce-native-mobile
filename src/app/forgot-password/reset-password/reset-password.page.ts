import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { CustomValidation } from '@shared/custom-validation';
import { LogService } from '@core/services/log.service';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  passwordResetRequestSuccessful: Boolean;

  form: FormGroup;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.'),
    ]
  }

  constructor(
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private logger: LogService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('login-password_reset');
    this.passwordResetRequestSuccessful = false;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, CustomValidation.email]]
    })
  }

  resetPassword() {
    this.logger.log(this.form.controls.email.value)
    this.api.resetPassword(this.form.controls.email.value).toPromise().then(() => {
      this.passwordResetRequestSuccessful = true;
    });
  }

}
