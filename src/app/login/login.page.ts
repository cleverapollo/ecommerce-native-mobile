import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from './login-form';
import { NavController } from '@ionic/angular';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { UserService } from '@core/services/user.service';
import { StorageService, StorageKeys } from '@core/services/storage.service';
import { CacheService } from 'ionic-cache';
import { CustomValidation } from '@shared/custom-validation';
import { LoadingService } from '@core/services/loading.service';
import { LogService } from '@core/services/log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.'),
    ],
    password: [
      new ValidationMessage('required', 'Gib bitte dein Passwort an.'),
    ]
  }

  constructor(
    private navController: NavController,
    private formBuilder: FormBuilder, 
    private authService: AuthenticationService,
    private userService: UserService,
    private storageService: StorageService,
    private logger: LogService) { 

  }

  ngOnInit() {
    this.createForm();
    this.patchValuesIfNeeded();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, CustomValidation.email]),
      password: this.formBuilder.control('', [Validators.required]),
      saveCredentials: this.formBuilder.control(false)
    })
  }

  private patchValuesIfNeeded() {
    this.userService.userSettings.then( settings => {
      if (settings && settings.credentialsSaved) {
        this.loginForm.controls['saveCredentials'].patchValue(settings.credentialsSaved);
        this.storageService.get(StorageKeys.LOGIN_EMAIL).then(email => {
          this.loginForm.controls['email'].patchValue(email);
        });
      }
    })
  }

  onSubmit() {
    const input = this.loginForm.value as LoginForm;
    this.authService.login(input.email, input.password, input.saveCredentials).then(() => {
      this.navToHome();
    }, errorReason => {
      this.logger.error(errorReason);
    });
  }

  navToPasswordForgottenPage() {
    this.navController.navigateForward('forgot-password/reset-password');
  }

  navToHome() {
    this.navController.navigateRoot('secure');
  }

  goBack() {
    this.navController.back();
  }

}
