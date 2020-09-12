import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidation } from '../shared/custom-validation';
import { UserApiService } from '../shared/api/user-api.service';
import { ChangePasswordRequest } from '../shared/api/user-api.model';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ValidationMessages, ValidationMessage } from '../shared/components/validation-messages/validation-message';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  passwordChangedSuccessful: boolean;
  token: string;

  form: FormGroup;
  validationMessages: ValidationMessages = {
    /*password: [
      new ValidationMessage('passwordDoesNotMatch', 'Die Passwört stimmen nicht überein.'),
    ],*/
    password: [
      new ValidationMessage('required', 'Gib bitte ein Passwort ein.'),
      new ValidationMessage('minlength', 'Kurze Passwörter sind leicht zu erraten. Verwende ein Passwort mit mindestens 7 Zeichen.'),
      new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben, einen Kleinbuchstaben und ein Sonderzeichen enthalten.'),
    ],
    passwordConfirm: [
      new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
    ]
  }

  constructor(
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.passwordChangedSuccessful = false;
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      value: [null, Validators.compose([
        Validators.required,
        CustomValidation.passwordValidator({ passwordTooWeak: true }),
        Validators.minLength(8)
      ])
      ],
      confirm: [null, Validators.compose([Validators.required])]
    }, { 
      validator: CustomValidation.passwordMatchValidator
    })
  }

  changePassword() {
    let request: ChangePasswordRequest = {
      password: this.form.controls.value.value,
      passwordConfirmed: this.form.controls.confirm.value,
      token: this.token
    }
    this.api.changePassword(request).toPromise().then( emptyResponse => {
      this.passwordChangedSuccessful = true;
    }, e => console.error);
  }

  navBackToLogin() {
    this.navController.navigateBack('/login');
  }

}
