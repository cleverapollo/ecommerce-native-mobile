import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  selector: 'app-creator-intro-text-update',
  templateUrl: './creator-intro-text-update.page.html',
  styleUrls: ['./creator-intro-text-update.page.scss'],
})
export class CreatorIntroTextUpdatePage implements OnInit {

  private readonly MIN_LENGTH = 10;
  private readonly MAX_LENGTH = 150;

  form: UntypedFormGroup;
  user: UserProfile;

  get validationMessages(): ValidationMessages {
    return {
      description: [
        new ValidationMessage('required', 'Bitte gib eine Beschreibung ein.'),
        new ValidationMessage('minlength', `Die Beschreibung muss aus min. ${this.MIN_LENGTH} Zeichen bestehen.`),
        new ValidationMessage('maxlength', `Dein Name darf max. ${this.MAX_LENGTH} aus Zeichen bestehen.`),
        new ValidationMessage('valueHasNotChanged', 'Die Beschreibung hat sich nicht geändert.')
      ]
    }
  }

  get formControl(): AbstractControl {
    return this.form.controls.description;
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
    this.analyticsService.setFirebaseScreenName('profile_settings-creator-intro_text');
  }

  saveChanges() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.api.updateDescription(this.user.creatorAccount.userName).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: updatedAccount => {
        this.formControl.reset(updatedAccount.description);
        this.userStore.updateCreatorAccount(updatedAccount);
        this.toastService.presentSuccessToast('Dein Name wurde erfolgreich aktualisiert.');
      },
      error: _ => {
        this.toastService.presentErrorToast('Dein Name konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
      },
    })
  }

  private async _setupForm() {
    this.user = await this.userStore.loadUserProfile().toPromise();
    this.form = this.formBuilder.group({
      description: this.formBuilder.control(this.user.creatorAccount.description ?? '', {
        validators: [
          Validators.required,
          Validators.minLength(this.MIN_LENGTH),
          Validators.maxLength(this.MAX_LENGTH),
          CustomValidation.valueHasChanged
        ],
        updateOn: 'submit'
      })
    });
  }

}
