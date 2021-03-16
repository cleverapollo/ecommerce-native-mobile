import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { UserApiService } from '@core/api/user-api.service';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from '@shared/components/hint/hint.component';
import { UpdatePasswordRequest } from '@core/models/login.model';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.page.html',
  styleUrls: ['./password-update.page.scss'],
})
export class PasswordUpdatePage implements OnInit {

  form: FormGroup;
  showHint: Boolean;
  hintConfig: HintConfig
  
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

  constructor(private formBuilder: FormBuilder, private api: UserApiService) { }

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

  saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    const request: UpdatePasswordRequest = {
      currentPassword: this.form.controls.currentPassword.value,
      newPassword: this.form.controls.value.value,
      newPasswordConfirmed: this.form.controls.confirm.value
    }
    this.api.updatePassword(request).toPromise()
      .then(() => {
        this.hintConfig = hintConfigForSuccessResponse;
      })
      .catch(e => {
        this.hintConfig = hintConfigForErrorResponse;
      })
      .finally(() => {
        this.showHint = true;
        setTimeout(() => {
          this.showHint = false;
        }, 3000);
      })
  }

}
