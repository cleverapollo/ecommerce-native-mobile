import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfileStore } from '../../user-profile-store.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { CustomValidation } from '@shared/custom-validation';
import { AnalyticsService } from '@core/services/analytics.service';
import { UserProfile } from '@core/models/user.model';
import { LogService } from '@core/services/log.service';

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
        new ValidationMessage('valueHasNotChanged', 'Dein Geburtsdatum hat sich nicht geändert.')
      ],
    }
  }

  constructor(
    private loadingService: LoadingService, 
    private toastService: CoreToastService,
    private formBuilder: FormBuilder, 
    private api: UserApiService, 
    private logger: LogService,
    private userProfileStore: UserProfileStore,
    private analyticsService: AnalyticsService
  ) 
  { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      birthday: this.formBuilder.control('', {
        validators: [CustomValidation.valueHasChanged],
        updateOn: 'submit'
      })
    });
    this.loadInitialValue();
  }

  async loadInitialValue() {
    const user = await this.userProfileStore.loadUserProfile().toPromise();
    if (user.birthday) {
      this.form.controls.birthday.setValue(this.timestampToISO(user.birthday));
    }
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-birthday');
  }

  async saveChanges() {
    // Validate form
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    this.loadingService.showLoadingSpinner();

    // Update value in DB
    let updatedProfile: UserProfile;
    try {
      updatedProfile = await this.api.partialUpdateBirthday(this.form.controls.birthday.value).toPromise();
      await this.loadingService.dismissLoadingSpinner();
      await this.toastService.presentSuccessToast('Dein Geburtsdatum wurde erfolgreich aktualisiert.');
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Dein Geburtsdatum konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
      this.loadingService.dismissLoadingSpinner();
      return
    }

    // Update value in Form
    this.form.controls.birthday.reset(this.timestampToISO(updatedProfile.birthday));

    // Update value in Cache
    try {
      await this.userProfileStore.updateCachedUserProfile(updatedProfile);
    } catch (error) {
      this.logger.error('Error while updating user profile in cache.');
    } 
  }

  private timestampToISO(timestamp: string | Date): string {
    return new Date(timestamp).toISOString()
  }

}
