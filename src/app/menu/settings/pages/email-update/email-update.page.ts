import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserApiService } from '@core/api/user-api.service';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { UpdateEmailChangeRequest, UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-email-update',
  templateUrl: './email-update.page.html',
  styleUrls: ['./email-update.page.scss'],
})
export class EmailUpdatePage implements OnInit {

  form: UntypedFormGroup;
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
    private formBuilder: UntypedFormBuilder,
    private api: UserApiService,
    private logger: Logger,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
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
    await this.loadingService.showLoadingSpinner();

    const requestBody = new UpdateEmailChangeRequest(this.form.controls);
    this.api.updateEmailChangeRequest(requestBody).pipe(
      first()
    ).subscribe({
      next: () => {
        this.form.controls.email.reset(this.email);
        this.authService.emailPasswordSignIn(this.email, this.password).then(() => {
          this.authService.sendVerificationMail().finally(() => {
            this.authService.updateEmailVerificationStatus(false);
            this.loadingService.stopLoadingSpinner();
          });
        }, error => {
          this.logger.error(error);
          this.handleReAuthError();
        });
      },
      error: errorResponse => {
        this.handleErrorResponse(errorResponse);
        this.loadingService.stopLoadingSpinner();
      }
    });
  }

  private async handleReAuthError() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login', { state: { email: this.email } });
    this.toastService.presentSuccessToast('Deine E-Mail-Adresse wurde erfolgreich geändert. Melde dich nun mit deiner neuen E-Mail-Adresse erneut an.')
    this.loadingService.stopLoadingSpinner();
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
