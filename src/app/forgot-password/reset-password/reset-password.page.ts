import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { CustomValidation } from '@shared/custom-validation';
import { LogService } from '@core/services/log.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { CoreToastService } from '@core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { LoadingService } from '@core/services/loading.service';

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
    private authService: AuthenticationService,
    private logger: LogService,
    private analyticsService: AnalyticsService,
    private toastService: CoreToastService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.passwordResetRequestSuccessful = false;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, CustomValidation.email]]
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('login-password_reset');
  }

  async resetPassword() {
    const loadingSpinner = await this.loadingService.createLoadingSpinner();
    await loadingSpinner.present();

    this.authService.resetPassword(this.form.controls.email.value).then(() => {
      this.passwordResetRequestSuccessful = true;
    }, error => {
      this.logger.error(error);
      let errorMessage = 'Beim Zurücksetzen deines Passworts ist ein Fehler aufgetreten.';
      if (typeof error === 'string') {
        const userDoesNotExist = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        if (error === userDoesNotExist) {
          errorMessage = 'Ein Benutzer mit angegebener E-Mail-Adresse existiert nicht.';
        }
      } else if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case HttpStatusCodes.NOT_FOUND:
            errorMessage = 'Ein Benutzer mit der angegebenen E-Mail-Adresse wurde nicht gefunden.';
            break;
        }
      }
      this.toastService.presentErrorToast(errorMessage);
    }).finally(() => {
      this.loadingService.dismissLoadingSpinner(loadingSpinner);
    });
  }

}
