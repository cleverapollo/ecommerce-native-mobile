import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';
import { CustomValidation } from 'src/app/shared/custom-validation';

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
        new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben, einen Kleinbuchstaben und ein Sonderzeichen enthalten.'),
      ],
      confirm: [
        new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
        new ValidationMessage('passwordDoesNotMatch', 'Die Passwört stimmen nicht überein.')
      ]
    }
  }

  constructor(private formBuilder: FormBuilder) { }

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
    console.log('save changes');
  }

}
