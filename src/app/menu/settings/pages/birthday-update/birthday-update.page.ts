import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { CoreToastService } from '@core/services/toast.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { subYears } from 'date-fns';
import { finalize, first } from 'rxjs/operators';
import { UserProfileStore } from '../../user-profile-store.service';

@Component({
  selector: 'app-birthday-update',
  templateUrl: './birthday-update.page.html',
  styleUrls: ['./birthday-update.page.scss'],
})
export class BirthdayUpdatePage implements OnInit {

  form: UntypedFormGroup;

  get maxDate(): string {
    const now = new Date();
    return subYears(now, 6).toISOString();
  }

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
    private formBuilder: UntypedFormBuilder,
    private api: UserApiService,
    private logger: Logger,
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

    // Update value in DB
    let updatedProfile: UserProfile;
    try {
      await this.loadingService.showLoadingSpinner();
      updatedProfile = await this.api.partialUpdateBirthday(this.form.controls.birthday.value).pipe(
        first(),
        finalize(() => {
          this.loadingService.stopLoadingSpinner();
        })
      ).toPromise();
      await this.toastService.presentSuccessToast('Dein Geburtsdatum wurde erfolgreich aktualisiert.');
    } catch (error) {
      this.logger.error(error);
      this.toastService.presentErrorToast('Dein Geburtsdatum konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
      return
    }

    // Update value in Form
    if (updatedProfile.birthday) {
      const isoDate = this.timestampToISO(updatedProfile.birthday);
      this.form.controls.birthday.reset(isoDate);
    }

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
