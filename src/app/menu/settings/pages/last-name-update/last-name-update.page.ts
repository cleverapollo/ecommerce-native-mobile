import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '@core/api/user-api.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { finalize, first } from 'rxjs/operators';
import { UserProfileStore } from '../../user-profile-store.service';

@Component({
  selector: 'app-last-name-update',
  templateUrl: './last-name-update.page.html',
  styleUrls: ['./last-name-update.page.scss'],
})
export class LastNameUpdatePage implements OnInit {

  form: FormGroup;

  get validationMessages(): ValidationMessages {
    return {
      lastName: [
        new ValidationMessage('required', 'Gib bitte deinen Nachnamen an.'),
        new ValidationMessage('minlength', 'Dein Nachname muss aus mindestens zwei Zeichen bestehen.'),
        new ValidationMessage('valueHasNotChanged', 'Dein Nachname hat sich nicht geändert.')
      ],
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private api: UserApiService,
    private userProfileStore: UserProfileStore,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      lastName: this.formBuilder.control('', {
        validators: [Validators.required, Validators.min(2), CustomValidation.valueHasChanged],
        updateOn: 'submit'
      })
    });
    this.loadInitialValue();
  }

  async loadInitialValue() {
    const user = await this.userProfileStore.loadUserProfile().toPromise();
    this.form.controls.lastName.setValue(user.lastName);
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-last_name');
  }

  async saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    try {
      await this.loadingService.showLoadingSpinner();
      const updatedProfile = await this.api.partialUpdateLastName(this.form.controls.lastName.value).pipe(
        first(),
        finalize(() => {
          this.loadingService.stopLoadingSpinner();
        })
      ).toPromise();
      this.userProfileStore.updateCachedUserProfile(updatedProfile);
      this.toastService.presentSuccessToast('Dein Nachname wurde erfolgreich aktualisiert.');
    } catch (error) {
      this.toastService.presentErrorToast('Dein Nachname konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
    }
  }

}
