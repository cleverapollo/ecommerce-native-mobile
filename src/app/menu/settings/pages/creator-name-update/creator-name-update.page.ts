import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-creator-name-update',
  templateUrl: './creator-name-update.page.html',
  styleUrls: ['./creator-name-update.page.scss'],
})
export class CreatorNameUpdatePage implements OnInit {

  private readonly NAME_MIN_LENGTH = 2;
  private readonly NAME_MAX_LENGTH = 63;

  form: FormGroup;
  user: UserProfile;

  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Bitte gib einen Namen ein.'),
        new ValidationMessage('minlength', `Dein Name muss aus min. ${this.NAME_MIN_LENGTH} Zeichen bestehen.`),
        new ValidationMessage('maxlength', `Dein Name darf max. ${this.NAME_MAX_LENGTH} aus Zeichen bestehen.`)
      ]
    }
  }

  get formControl(): AbstractControl {
    return this.form.controls.name;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly loadingService: LoadingService,
    private readonly toastService: CoreToastService,
    private readonly userStore: UserProfileStore,
    private readonly analyticsService: AnalyticsService,
    private readonly api: ContentCreatorApiService
  ) { }

  ngOnInit() {
    this._setupForm();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('profile_settings-creator-name');
  }

  async saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    try {
      await this.loadingService.showLoadingSpinner();
      const updatedAccount = await this.api.updateName(this.user.creatorAccount.userName, this.formControl.value).pipe(
        first(),
        finalize(() => {
          this.loadingService.stopLoadingSpinner();
        })
      ).toPromise();
      this.formControl.reset(updatedAccount.name);
      this.userStore.updateCreatorAccount(updatedAccount);
      this.toastService.presentSuccessToast('Dein Name wurde erfolgreich aktualisiert.');
    } catch (error) {
      this.toastService.presentErrorToast('Dein Name konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
    }
  }

  private async _setupForm() {
    this.user = await this.userStore.loadUserProfile().toPromise();
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(this.user.creatorAccount.name ?? '', {
        validators: [Validators.required, Validators.minLength(this.NAME_MIN_LENGTH), Validators.maxLength(this.NAME_MAX_LENGTH)],
        updateOn: 'submit'
      })
    });
  }

}
