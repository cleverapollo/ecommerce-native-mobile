import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from './login-form';
import { NavController } from '@ionic/angular';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { AuthenticationService } from '@core/services/authentication.service';
import { CustomValidation } from '@shared/custom-validation';
import { LogService } from '@core/services/log.service';
import { ToastService } from '@core/services/toast.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { AuthProvider } from '@core/models/signup.model';
import { Router } from '@angular/router';

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
    private router: Router,
    private navController: NavController,
    private formBuilder: FormBuilder, 
    private authService: AuthenticationService,
    private logger: LogService,
    private toastService: ToastService,
    private analyticsService: AnalyticsService,
    private loadingService: LoadingService
  ) { 
    this.analyticsService.setFirebaseScreenName('login');
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    const email = this.router.getCurrentNavigation().extras.state?.email ?? '';
    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control(email, {
        validators: [Validators.required, CustomValidation.email],
        updateOn: 'blur' 
      }),
      password: this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'blur' 
      }),
      saveCredentials: this.formBuilder.control(true)
    })
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      CustomValidation.validateFormGroup(this.loginForm);
      return;
    }
    const spinner = await this.loadingService.createLoadingSpinner();
    await spinner.present();
    
    const input = this.loginForm.value as LoginForm;
    this.authService.emailPasswordSignIn(input.email, input.password).then(() => {
      this.toastService.presentSuccessToast('Deine Anmeldung war erfolgreich!');
      this.analyticsService.logLoginEvent(AuthProvider.WANTIC);
      this.navToHome();
    }, errorReason => {
      this.logger.error(errorReason);
    }).finally(() => {
      this.loadingService.dismissLoadingSpinner(spinner);
    });
  }

  navToPasswordForgottenPage() {
    this.navController.navigateForward('forgot-password/reset-password');
  }

  navToHome() {
    this.navController.navigateRoot('secure', { replaceUrl: true });
  }

  goBack() {
    this.navController.back();
  }

}
