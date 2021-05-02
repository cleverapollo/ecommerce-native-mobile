import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { CustomValidation } from '@shared/custom-validation';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { EmailVerificationService } from '@core/services/email-verification.service';
import { EmailVerificationStatus, UpdateEmailChangeRequest, UserProfile } from '@core/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { LogService } from '@core/services/log.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { first } from 'rxjs/operators';

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
    private emailVerificationService: EmailVerificationService,
    private userProfileStore: UserProfileStore,
    private analyticsService: AnalyticsService
  ) {
    this.analyticsService.setFirebaseScreenName('profile_settings-email');
  }

  ngOnInit() {
    this.userProfileStore.loadUserProfile().pipe(first()).subscribe({
      next: userProfile => {
        this.userProfile = userProfile;
        const email = userProfile.email.value;
        if (!this.form) {
          this.createForm(email);
        }
      },
      error: error => {
        this.logger.debug(error);
        this.createForm('');
      }
    })
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

  saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    this.loadingService.showLoadingSpinner();
    const requestBody = new UpdateEmailChangeRequest(this.form.controls);
    const email = this.form.controls.email.value;
    this.api.updateEmailChangeRequest(requestBody).pipe(first()).subscribe({
      next: () => {
        this.form.controls.email.reset(email);
        this.emailVerificationService.updateEmailVerificationStatus(false);
      }, 
      error: errorResponse => {
        let errorMessage = 'Ein allgemeiner Fehler ist aufgetreten, bitte versuche es später noch einmal.';
        if (errorResponse instanceof HttpErrorResponse) {
          if (errorResponse.error instanceof ErrorEvent) {
            this.logger.log(`Error: ${errorResponse.error.message}`);
          } else if (errorResponse.status === HttpStatusCodes.CONFLICT) {
            errorMessage = 'Die angegebene E-Mail Adresse ist bereits in unserem System registriert.';
          }
        }
        this.toastService.presentErrorToast(errorMessage);
      },
      complete: () => {
        this.loadingService.dismissLoadingSpinner();
      }
    });

  }

}
