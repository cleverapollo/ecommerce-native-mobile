import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LoginForm } from './login-form';
import { NavController } from '@ionic/angular';
import { ValidationMessages, ValidationMessage } from '../shared/components/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { StorageService, StorageKeys } from '../shared/services/storage.service';

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
      new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
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
    private storageService: StorageService) { 

  }

  ngOnInit() {
    this.navToHomeIfAlreadyLoggedIn();
    this.createForm();
    this.patchValuesIfNeeded();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
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
      this.loginForm.reset();
      this.navToHome();
    }).catch(() => {
      console.error('Fehler beim Login!');
    });
  }

  navToPasswordForgottenPage() {
    this.navController.navigateForward('reset-password');
  }

  navToHome() {
    this.navController.navigateRoot('secure/home');
  }

  navToHomeIfAlreadyLoggedIn() {
    this.authService.authenticationState.subscribe(state => {
      if (state) {
        this.navToHome();
      }
    });
  }

  goBack() {
    this.navController.back();
  }

}
