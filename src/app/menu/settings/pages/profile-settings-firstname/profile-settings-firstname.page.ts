import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfileStore } from '../../user-profile-store.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { CustomValidation } from '@shared/custom-validation';
import { AnalyticsService } from '@core/services/analytics.service';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-profile-settings-firstname',
  templateUrl: './profile-settings-firstname.page.html',
  styleUrls: ['./profile-settings-firstname.page.scss'],
})
export class ProfileSettingsFirstnamePage implements OnInit {

  form: UntypedFormGroup;

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
    private formBuilder: UntypedFormBuilder,
    private api: UserApiService,
    private userProfileStore: UserProfileStore,
    private toastService: CoreToastService,
    private analyticsService: AnalyticsService
  )
  { }

  ngOnInit() {
    const firstName = history?.state?.data?.profile.firstName;
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control(firstName, {
        validators: [Validators.required, Validators.min(2), CustomValidation.valueHasChanged],
        updateOn: 'submit'
      })
    });
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-first_name');
  }

  async saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    try {
      await this.loadingService.showLoadingSpinner();
      const updatedProfile = await this.api.partialUpdateFirstName(this.form.controls.firstName.value).pipe(
        first(),
        finalize(() => {
          this.loadingService.stopLoadingSpinner();
        })
      ).toPromise();
      this.form.controls.firstName.reset(updatedProfile.firstName);
      this.userProfileStore.updateCachedUserProfile(updatedProfile);
      this.toastService.presentSuccessToast('Dein Vorname wurde erfolgreich aktualisiert.');
    } catch (error) {
      this.toastService.presentErrorToast('Dein Vorname konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
    }
  }

}
