import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LoginForm } from './login-form';
import { NavController } from '@ionic/angular';
import { ValidationMessages, ValidationMessage } from '../shared/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute) { 

  }

  ngOnInit() {
    this.authService.authenticationState.subscribe(state => {
      if (state) {
        this.navToHome();
      }
    });
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      password: this.formBuilder.control('', [Validators.required]),
      saveCredentials: this.formBuilder.control(false)
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

  goBack() {
    this.navController.back();
  }

}
