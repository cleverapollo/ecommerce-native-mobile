import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { WanticError } from '@core/models/error.model';
import { UserProfile } from '@core/models/user.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-creator-user-name-update',
  templateUrl: './creator-user-name-update.page.html',
  styleUrls: ['./creator-user-name-update.page.scss'],
})
export class CreatorUserNameUpdatePage implements OnInit {

  private readonly NAME_MIN_LENGTH = 2;
  private readonly NAME_MAX_LENGTH = 31;

  form: UntypedFormGroup;
  user: UserProfile;

  get validationMessages(): ValidationMessages {
    return {
      userName: [
        new ValidationMessage('required', 'Bitte gib einen Benutzernamen ein.'),
        new ValidationMessage('minlength', `Dein Name muss aus min. ${this.NAME_MIN_LENGTH} Zeichen bestehen.`),
        new ValidationMessage('maxlength', `Dein Name darf max. ${this.NAME_MAX_LENGTH} aus Zeichen bestehen.`),
        new ValidationMessage('valueHasNotChanged', 'Der Name hat sich nicht geändert.')
      ]
    }
  }

  get formControl(): AbstractControl {
    return this.form.controls.userName;
  }

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
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
    this.analyticsService.setFirebaseScreenName('profile_settings-creator-user_name');
  }

  saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.api.updateUserName(this.user.creatorAccount.userName).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: updatedAccount => {
        this.formControl.reset(updatedAccount.userName);
        this.userStore.updateCreatorAccount(updatedAccount);
        this.toastService.presentSuccessToast('Dein Name wurde erfolgreich aktualisiert.');
      },
      error: error => {
        let message = 'Dein Name konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.';
        if (error instanceof WanticError) {
          if (error.httpStatusCode === 409) {
            message = 'Der Benutzername ist bereits vergeben.'
          }
        }
        this.toastService.presentErrorToast(message);
      },
    })
  }

  private async _setupForm() {
    this.user = await this.userStore.loadUserProfile().toPromise();
    this.form = this.formBuilder.group({
      userName: this.formBuilder.control(this.user.creatorAccount.userName ?? '', {
        validators: [
          Validators.required,
          Validators.minLength(this.NAME_MIN_LENGTH),
          Validators.maxLength(this.NAME_MAX_LENGTH),
          CustomValidation.valueHasChanged
        ],
        updateOn: 'submit'
      })
    });
  }
}
