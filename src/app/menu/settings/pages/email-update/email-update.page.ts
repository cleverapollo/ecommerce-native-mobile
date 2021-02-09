import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfileStore } from '../../user-profile-store.service';
import { CustomValidation } from '@shared/custom-validation';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { EmailVerificationService } from '@core/services/email-verification.service';

@Component({
  selector: 'app-email-update',
  templateUrl: './email-update.page.html',
  styleUrls: ['./email-update.page.scss'],
})
export class EmailUpdatePage implements OnInit {

  form: FormGroup;
  initialValue: string;
  
  get validationMessages(): ValidationMessages {
    return {
      email: [
        new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
      ]
    }
  }

  constructor(
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private userProfileStore: UserProfileStore,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private emailVerificationService: EmailVerificationService) 
    { }

  ngOnInit() {
    const email = history.state.data.profile.email.value;
    this.initialValue = email;
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(email, [Validators.required, CustomValidation.email])
    });
  }

  unchanged(): boolean {
    return this.initialValue == this.form.controls['email'].value;
  }

  saveChanges() {
    this.loadingService.showLoadingSpinner();
    this.api.partialUpdateEmail(this.form.controls.email.value).toPromise()
      .then(updatedProfile => {
        this.emailVerificationService.updateEmailVerificationStatus(updatedProfile.email.status);
        this.userProfileStore.updateCachedUserProfile(updatedProfile);
      })
      .catch(e => {
        this.toastService.presentErrorToast('Deine E-Mail-Adresse konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
      })
      .finally(() => {
        this.loadingService.dismissLoadingSpinner();
      });
  }

}
