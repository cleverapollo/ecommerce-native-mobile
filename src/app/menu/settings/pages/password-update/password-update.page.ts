import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { UserApiService } from '@core/api/user-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { Logger } from '@core/services/log.service';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.page.html',
  styleUrls: ['./password-update.page.scss'],
})
export class PasswordUpdatePage implements OnInit {

  form: UntypedFormGroup;

  get validationMessages(): ValidationMessages {
    return {
      currentPassword: [
        new ValidationMessage('required', 'Gib bitte ein Passwort ein.'),
      ],
      value: [
        new ValidationMessage('required', 'Gib bitte ein Passwort ein.'),
        new ValidationMessage('minlength', 'Kurze Passwörter sind leicht zu erraten. Verwende ein Passwort mit mindestens 7 Zeichen.'),
        new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben und einen Kleinbuchstaben enthalten.'),
      ],
      confirm: [
        new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
        new ValidationMessage('passwordDoesNotMatch', 'Die Passwörter stimmen nicht überein.')
      ]
    }
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private api: UserApiService,
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private logger: Logger
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      currentPassword: this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      value: this.formBuilder.control('', {
        validators: [
          Validators.required,
          CustomValidation.passwordValidator({ passwordTooWeak: true }),
          Validators.minLength(8)
        ],
        updateOn: 'blur'
      }),
      confirm: this.formBuilder.control('', {
        validators: [
          Validators.required,
          CustomValidation.passwordValidator({ passwordTooWeak: true }),
          Validators.minLength(8)
        ],
        updateOn: 'blur'
      }),
    }, {
      validator: CustomValidation.passwordMatchValidator
    });
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-password');
  }

  async saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    try {
      await this.loadingService.showLoadingSpinner();
      await this.api.updatePassword({
        currentPassword: this.form.controls.currentPassword.value,
        newPassword: this.form.controls.value.value,
        newPasswordConfirmed: this.form.controls.confirm.value
      }).pipe(
        first(),
        finalize(() => {
          this.loadingService.stopLoadingSpinner();
        })
      ).toPromise();
      this.form.reset();
      this.toastService.presentSuccessToast('Dein Passwort wurde erfolgreich geändert.')
    } catch (error) {
      this.logger.error(error);
    }
  }

}
