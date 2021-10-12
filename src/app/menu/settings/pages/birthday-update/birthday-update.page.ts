import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfileStore } from '../../user-profile-store.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { CustomValidation } from '@shared/custom-validation';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-birthday-update',
  templateUrl: './birthday-update.page.html',
  styleUrls: ['./birthday-update.page.scss'],
})
export class BirthdayUpdatePage implements OnInit {

  form: FormGroup;

  get validationMessages(): ValidationMessages {
    return {
      birthday: [
        new ValidationMessage('required', 'Gib bitte dein Geburtsdatum an.'),
        new ValidationMessage('valueHasNotChanged', 'Dein Geburtsdatum hat sich nicht geändert.')
      ],
    }
  }

  constructor(
    private loadingService: LoadingService, 
    private toastService: CoreToastService,
    private formBuilder: FormBuilder, 
    private api: UserApiService, 
    private userProfileStore: UserProfileStore,
    private analyticsService: AnalyticsService
  ) 
  { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      birthday: this.formBuilder.control('', {
        validators: [Validators.required, CustomValidation.valueHasChanged],
        updateOn: 'submit'
      })
    });
    this.loadInitialValue();
  }

  async loadInitialValue() {
    const user = await this.userProfileStore.loadUserProfile().toPromise();
    if (user.birthday) {
      this.form.controls.birthday.setValue(new Date(user.birthday).toISOString());
    }
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-birthday');
  }

  saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    this.loadingService.showLoadingSpinner();
    this.api.partialUpdateBirthday(this.form.controls.birthday.value).toPromise()
      .then(updatedProfile => {
        this.form.controls.birthday.reset(updatedProfile.birthday);
        this.userProfileStore.updateCachedUserProfile(updatedProfile);
        this.toastService.presentSuccessToast('Dein Geburtsdatum wurde erfolgreich aktualisiert.');
      })
      .catch(e => {
        this.toastService.presentErrorToast('Dein Geburtsdatum konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
      })
      .finally(() => {
        this.loadingService.dismissLoadingSpinner();
      });
  }


}
