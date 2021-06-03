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
import { StorageKeys, StorageService } from '@core/services/storage.service';

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

  constructor(
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private logger: LogService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private userProfileStore: UserProfileStore,
    private analyticsService: AnalyticsService,
    private authService: AuthenticationService,
    private storageService: StorageService
  ) {
    this.analyticsService.setFirebaseScreenName('profile_settings-email');
  }

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
        const email = this.form.controls.email.value;
        const password = this.form.controls.password.value;
        this.form.controls.email.reset(email);
        this.authService.emailPasswordSignIn(email, password).then(() => {
          this.authService.sendVerificationMail().finally(() => {
            this.updateEmailVerificationStatus();
            this.loadingService.dismissLoadingSpinner(busyIndicator);
          });
        });
      }, 
      error: errorResponse => {
        this.handleErrorResponse(errorResponse);
        this.loadingService.dismissLoadingSpinner(busyIndicator);
      }
    });
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

  private updateEmailVerificationStatus() {
    const userInfo = this.authService.userInfo.value;
    userInfo.emailVerified = false;
    this.authService.userInfo.next(userInfo);
    this.storageService.set(StorageKeys.FIREBASE_EMAIL_VERIFIED, false, true);
  }
}
