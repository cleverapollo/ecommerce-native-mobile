import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { UserApiService } from '@core/api/user-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { LogService } from '@core/services/log.service';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.page.html',
  styleUrls: ['./password-update.page.scss'],
})
export class PasswordUpdatePage implements OnInit {

  form: FormGroup;
  
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
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private logger: LogService
  ) { 
    this.analyticsService.setFirebaseScreenName('profile_settings-password');
  }

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

  async saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    const busyIndicator = await this.loadingService.createLoadingSpinner();
    busyIndicator.present();

    try {
      await this.api.updatePassword({
        currentPassword: this.form.controls.currentPassword.value,
        newPassword: this.form.controls.value.value,
        newPasswordConfirmed: this.form.controls.confirm.value
      }).toPromise();
      this.toastService.presentSuccessToast('Dein Passwort wurde erfolgreich geändert.')
    } catch (error) {
      this.logger.error(error);
    }

    this.loadingService.dismissLoadingSpinner(busyIndicator);
  }

}
