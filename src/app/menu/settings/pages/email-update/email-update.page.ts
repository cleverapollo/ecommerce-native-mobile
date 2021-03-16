import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@core/services/authentication.service';
import { Location } from '@angular/common';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { WanticJwtToken } from '@core/models/login.model';

@Component({
  selector: 'app-email-update',
  templateUrl: './email-update.page.html',
  styleUrls: ['./email-update.page.scss'],
})
export class EmailUpdatePage implements OnInit, OnDestroy {

  private updateEmailChangeRequestSubscription: Subscription;
  private updateEmailSubscription: Subscription;
  private routeParamSubscription: Subscription;
  private confirmRegistrationSubscription: Subscription;
  private getUserProfileSubscription: Subscription;

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
    private route: ActivatedRoute,
    private userProfileStore: UserProfileStore,
    private location: Location,
    private jwtHelper: JwtHelperService,
    private authService: AuthenticationService) 
    { }

  ngOnInit() {
    this.getUserProfileSubscription = this.userProfileStore.loadUserProfile().subscribe({
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

    this.routeParamSubscription = this.route.queryParamMap.subscribe({
      next: params => {
        const emailVerificationToken = params.get('emailVerificationToken');
        if (emailVerificationToken !== null) {
          this.updateEmail(emailVerificationToken);
        }
      }
    });
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

  ngOnDestroy() {
    this.updateEmailChangeRequestSubscription?.unsubscribe();
    this.updateEmailSubscription?.unsubscribe();
    this.routeParamSubscription?.unsubscribe();
    this.confirmRegistrationSubscription?.unsubscribe();
    this.getUserProfileSubscription?.unsubscribe();
  }

  saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    this.loadingService.showLoadingSpinner();
    const requestBody = new UpdateEmailChangeRequest(this.form.controls);
    const email = this.form.controls.email.value;
    this.updateEmailChangeRequestSubscription = this.api.updateEmailChangeRequest(requestBody).subscribe({
      next: () => {
        this.form.controls.email.reset(email);
        this.emailVerificationService.updateEmailVerificationStatus(EmailVerificationStatus.VERIFICATION_EMAIL_SENT);
        this.loadingService.dismissLoadingSpinner();
      }, 
      error: errorResponse => {
        let errorMessage = 'Ein allgemeiner Fehler ist aufgetreten, bitte versuche es später noch einmal.';
        if (errorResponse instanceof HttpErrorResponse) {
          if (errorResponse.error instanceof ErrorEvent) {
            this.logger.log(`Error: ${errorResponse.error.message}`);
          } else if (errorResponse.status === HttpStatusCodes.BAD_REQUEST) {
            errorMessage = 'Dein Passwort ist nicht korrekt.';
          } else if (errorResponse.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
            errorMessage = 'Eine E-Mail zur Bestätigung deiner Anfrage an deine angegebene E-Mail-Adresse konnte nicht zugestellt werden.';
          } else if (errorResponse.status === HttpStatusCodes.CONFLICT) {
            errorMessage = 'Die angegebene E-Mail Adresse ist bereits in unserem System registriert.';
          }
        }
        this.toastService.presentErrorToast(errorMessage);
        this.loadingService.dismissLoadingSpinner();
      }
    });

  }

  private updateEmail(emailVerificationToken: string) {
    this.loadingService.showLoadingSpinner();
    this.updateEmailSubscription = this.api.partialUpdateEmail(emailVerificationToken).subscribe({
      next: jwtResponse => {
        const jwToken = jwtResponse.token;
        this.authService.updateToken(jwToken);
        
        const decodedToken = this.jwtHelper.decodeToken(jwToken) as WanticJwtToken;
        this.userProfile.email.value = decodedToken.sub;
        this.userProfileStore.updateCachedUserProfile(this.userProfile);

        this.location.replaceState('secure/menu/settings/email-update');
        this.toastService.presentSuccessToast('Deine E-Mail-Adresse wurde erfolgreich geändert!');
        this.loadingService.dismissLoadingSpinner();
      }, 
      error: errorResponse => {
        let errorMessage = 'Es ist ein Fehler aufgetretet. Deine E-Mail-Adresse konnte nicht bestätigt werden.';
        if (errorResponse instanceof HttpErrorResponse) {
          if (errorResponse.error instanceof ErrorEvent) {
            this.logger.log(`Error: ${errorResponse.error.message}`);
          } else if (errorResponse.status === HttpStatusCodes.BAD_REQUEST) {
            errorMessage = 'Dein Bestätigungslink ist abgelaufen.';
          } else if (errorResponse.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
            errorMessage = 'Eine E-Mail zur Bestätigung deiner Anfrage an deine angegebene E-Mail-Adresse konnte nicht zugestellt werden.';
          }
        }
        this.toastService.presentErrorToast(errorMessage);
        this.loadingService.dismissLoadingSpinner();
      }
    })
  }

}
