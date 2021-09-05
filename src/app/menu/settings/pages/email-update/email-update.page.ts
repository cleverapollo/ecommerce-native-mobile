import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { CustomValidation } from '@shared/custom-validation';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { UpdateEmailChangeRequest, UserProfile } from '@core/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { LogService } from '@core/services/log.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-update',
  templateUrl: './email-update.page.html',
  styleUrls: ['./email-update.page.scss'],
})
export class EmailUpdatePage implements OnInit {

  form: FormGroup;
  userProfile: UserProfile;
  
  get validationMessages(): ValidationMessages {
    return {
      email: [
        new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
        new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.'),
        new ValidationMessage('valueHasNotChanged', 'Deine E-Mail Adresse hat sich nicht geändert.')
      ],
      password: [
        new ValidationMessage('required', 'Gib bitte dein Passwort an.'),
      ]
    }
  }

  get email(): string {
    return this.form.controls.email.value;
  }

  get password(): string {
    return this.form.controls.password.value;
  }

  constructor(
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private logger: LogService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private userProfileStore: UserProfileStore,
    private analyticsService: AnalyticsService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = await this.userProfileStore.loadUserProfile().toPromise();
    const email = user?.email?.value ?? '';
    this.createForm(email);
  }

  private createForm(email: string) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(email, {
        validators: [Validators.required, CustomValidation.email, CustomValidation.valueHasChanged],
        updateOn: 'blur'
      }),
      password: this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'blur'
      })
    });
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-email');
  }

  async saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    const busyIndicator = await this.loadingService.createLoadingSpinner();
    busyIndicator.present();
    const requestBody = new UpdateEmailChangeRequest(this.form.controls);
    this.api.updateEmailChangeRequest(requestBody).pipe(first()).subscribe({
      next: () => {
        this.form.controls.email.reset(this.email);
        this.authService.emailPasswordSignIn(this.email, this.password).then(() => {
          this.authService.sendVerificationMail().finally(() => {
            this.authService.updateEmailVerificationStatus(false);
            this.loadingService.dismissLoadingSpinner(busyIndicator);
          });
        }, error => {
          this.logger.error(error);
          this.handleReAuthError(busyIndicator);
        });
      }, 
      error: errorResponse => {
        this.handleErrorResponse(errorResponse);
        this.loadingService.dismissLoadingSpinner(busyIndicator);
      }
    });
  }

  private async handleReAuthError(busyIndicator: HTMLIonLoadingElement) {
    await this.authService.logout();
    await this.router.navigateByUrl('/login', { state: { email: this.email } });
    this.toastService.presentSuccessToast('Deine E-Mail-Adresse wurde erfolgreich geändert. Melde dich nun mit deiner neuen E-Mail-Adresse erneut an.')
    this.loadingService.dismissLoadingSpinner(busyIndicator);
  }

  private handleErrorResponse(errorResponse: any) {
    let errorMessage = 'Ein allgemeiner Fehler ist aufgetreten, bitte versuche es später noch einmal.';
    if (errorResponse instanceof HttpErrorResponse) {
      if (errorResponse.error instanceof ErrorEvent) {
        this.logger.log(`Error: ${errorResponse.error.message}`);
      } else if (errorResponse.status === HttpStatusCodes.CONFLICT) {
        errorMessage = 'Die angegebene E-Mail Adresse ist bereits in unserem System registriert.';
      }
    }
    this.toastService.presentErrorToast(errorMessage);
  }

}
