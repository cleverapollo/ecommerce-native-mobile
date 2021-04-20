import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidation } from '@shared/custom-validation';
import { UserApiService } from '@core/api/user-api.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { ChangePasswordRequest } from '@core/models/login.model';
import { AnalyticsService } from '@core/services/analytics.service';

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
      new ValidationMessage('passwordTooWeak', 'Dein Passwort muss mindestens eine Zahl, einen Großbuchstaben und einen Kleinbuchstaben enthalten.'),
    ],
    passwordConfirm: [
      new ValidationMessage('required', 'Bestätige bitte dein Passwort.'),
    ]
  }

  constructor(
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('login-password_reset-change_password');
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
    this.api.changePassword(request).toPromise().then(() => {
      this.passwordChangedSuccessful = true;
    });
  }

  navBackToLogin() {
    this.navController.navigateBack('/login');
  }

}
