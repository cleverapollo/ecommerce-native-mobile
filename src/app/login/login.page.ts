import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LoginForm } from './login-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) { 
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    const input = this.loginForm.value as LoginForm;
    this.authService.login(input.email, input.password).then(() => {
      this.router.navigate(['home']);
    }).catch(() => {
      console.error('Fehler beim Login!');
    });
  }

}
