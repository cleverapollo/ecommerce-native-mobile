import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LoginForm } from './login-form';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(
    private navController: NavController,
    private formBuilder: FormBuilder, 
    private authService: AuthenticationService, 
    private router: Router) { 

  }

  ngOnInit() {
    this.authService.authenticationState.subscribe(state => {
      if (state) {
        this.router.navigate(['home']);
      }
    });
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      password: this.formBuilder.control('', [Validators.required])
    })
  }

  onSubmit() {
    const input = this.loginForm.value as LoginForm;
    this.authService.login(input.email, input.password).then(() => {
      this.loginForm.reset();
      this.router.navigate(['home']);
    }).catch(() => {
      console.error('Fehler beim Login!');
    });
  }

  goBack() {
    this.navController.back();
  }

}
