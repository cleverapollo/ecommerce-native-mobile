import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidation } from '@shared/custom-validation';
import { UserApiService } from '@core/api/user-api.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { ChangePasswordRequest } from '@core/models/login.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { GoogleApiService } from '@core/api/google-api.service';
import { first } from 'rxjs/operators';
import { LogService } from '@core/services/log.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@core/api/auth.service';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { Plugins } from '@capacitor/core';
import { Subscription } from 'rxjs';

const { Device } = Plugins;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit, OnDestroy {

  canShowBackToLoginButton: boolean;
  passwordChanged: boolean;

  email: string;
  oobCode: string;
  token: string; // deprecated

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

  private queryParamSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder, 
    private authApi: AuthService,
    private api: UserApiService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private googleApiService: GoogleApiService,
    private loadingService: LoadingService,
    private logger: LogService,
    private toastService: ToastService
  ) { 
    this.analyticsService.setFirebaseScreenName('login-password_reset-change_password');
  }

  async ngOnInit() {
    const deviceInfo = await Device.getInfo();
    this.canShowBackToLoginButton = deviceInfo.platform === 'ios' || deviceInfo.platform === 'android';
    this.passwordChanged = false;
    this.queryParamSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      this.oobCode = params['oobCode'];
    });
    this.initForm();
  }

  ngOnDestroy(): void {
    this.queryParamSubscription.unsubscribe();
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
    if (this.oobCode) {
      this.resetPassword();
    } else if (this.token) {
      let request: ChangePasswordRequest = {
        password: this.form.controls.value.value,
        passwordConfirmed: this.form.controls.confirm.value,
        token: this.token
      }
      this.api.changePassword(request).toPromise().then(() => {
        this.passwordChanged = true;
      });
    }
  }

  async resetPassword() {
    const newPassword = this.form.controls.value.value;
    const spinner = await this.loadingService.createLoadingSpinner();
    spinner.present();
    try {
      const verifyEmailResponse = await this.googleApiService.verifyPasswortResetCode(this.oobCode).toPromise();
      this.authApi.confirmPasswordReset({
        email: verifyEmailResponse.email,
        oobCode: this.oobCode, 
        newPassword: newPassword
      }).pipe(first()).subscribe(responseBody => {
        this.logger.debug(responseBody);
        this.passwordChanged = true;
        this.toastService.presentSuccessToast('Dein Passwort wurde erfolgreich geändert.');
      }, error => {
        this.logger.error(error);
        this.passwordChanged = false;
        this.toastService.presentErrorToast('Beim Ändern deines Passworts ist ein Fehler aufgetreten.');
      }, () => {
        this.loadingService.dismissLoadingSpinner(spinner);
      })
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      this.logger.error(errorMessage);
      this.passwordChanged = false;
      this.loadingService.dismissLoadingSpinner(spinner);
      this.toastService.presentErrorToast('Beim Ändern deines Passworts ist ein Fehler aufgetreten.');
    }
  }

  private getErrorMessage(error: HttpErrorResponse) {
    let errorMessage = error.message;
    if (typeof error.error === 'string') {
      const googleApiError = JSON.parse(error.error);
      if (googleApiError?.error?.message) {
        errorMessage = googleApiError?.error?.message;
      }
    }
    return errorMessage;
  }

  navBackToLogin() {
    this.navController.navigateBack('/login');
  }

}
