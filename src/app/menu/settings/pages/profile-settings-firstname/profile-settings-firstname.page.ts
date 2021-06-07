import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfileStore } from '../../user-profile-store.service';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { CustomValidation } from '@shared/custom-validation';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-profile-settings-firstname',
  templateUrl: './profile-settings-firstname.page.html',
  styleUrls: ['./profile-settings-firstname.page.scss'],
})
export class ProfileSettingsFirstnamePage implements OnInit {

  form: FormGroup;

  get validationMessages(): ValidationMessages {
    return {
      firstName: [
        new ValidationMessage('required', 'Gib bitte deinen Vornamen an.'),
        new ValidationMessage('minlength', 'Dein Vorname muss aus mindestens zwei Zeichen bestehen.'),
        new ValidationMessage('valueHasNotChanged', 'Dein Vorname hat sich nicht geändert.')
      ],
    }
  }

  constructor(
    private loadingService: LoadingService, 
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private userProfileStore: UserProfileStore,
    private toastService: ToastService,
    private analyticsService: AnalyticsService
  ) 
  { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName('profile_settings-first_name');
    const firstName = history?.state?.data?.profile.firstName;
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control(firstName, {
        validators: [Validators.required, Validators.min(2), CustomValidation.valueHasChanged],
        updateOn: 'submit'
      })
    });
  }

  saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.loadingService.showLoadingSpinner();
    this.api.partialUpdateFirstName(this.form.controls.firstName.value).toPromise()
      .then(updatedProfile => {
        this.form.controls.firstName.reset(updatedProfile.firstName);
        this.userProfileStore.updateCachedUserProfile(updatedProfile);
        this.toastService.presentSuccessToast('Dein Vorname wurde erfolgreich aktualisiert.')
      })
      .catch(error => {
        this.toastService.presentErrorToast('Dein Vorname konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.')
      })
      .finally(() => {
        this.loadingService.dismissLoadingSpinner();
      })
  }

}
