import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/components/validation-messages/validation-message';
import { CustomValidation } from 'src/app/shared/custom-validation';
import { UserApiService } from 'src/app/shared/api/user-api.service';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from 'src/app/shared/components/hint/hint.component';
import { UpdatePasswordRequest } from 'src/app/shared/models/login.model';

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
        new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben, einen Kleinbuchstaben und ein Sonderzeichen enthalten.'),
      ],
      confirm: [
        new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
        new ValidationMessage('passwordDoesNotMatch', 'Die Passwört stimmen nicht überein.')
      ]
    }
  }

  constructor(private formBuilder: FormBuilder, private api: UserApiService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      currentPassword: this.formBuilder.control('', [
        Validators.required,
      ]),
      value: this.formBuilder.control('', [
        Validators.required, 
        CustomValidation.passwordValidator({ passwordTooWeak: true }),
        Validators.minLength(8)
      ]),
      confirm: this.formBuilder.control('', [
        Validators.required, 
        CustomValidation.passwordValidator({ passwordTooWeak: true }),
        Validators.minLength(8)
      ]),
    }, { 
      validator: CustomValidation.passwordMatchValidator
    });
  }

  saveChanges() {
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
        console.error(e);
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
