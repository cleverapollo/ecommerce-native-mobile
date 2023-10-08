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
  selector: 'app-creator-social-media-links-update',
  templateUrl: './creator-social-media-links-update.page.html',
  styleUrls: ['./creator-social-media-links-update.page.scss'],
})
export class CreatorSocialMediaLinksUpdatePage implements OnInit {

  private readonly URL_MAX_LENGTH = 2048;
  private readonly URL_MIN_LENGTH = 25;

  form: UntypedFormGroup;
  user: UserProfile;
  showNoChangesMessage = false;

  get validationMessages(): ValidationMessages {
    return {
      socialMediaUrl: [
        new ValidationMessage('pattern', 'Bitte gib eine gültige URL an.'),
        new ValidationMessage('maxlength', `Die URL ist zu lang.`),
        new ValidationMessage('minlength', `Die URL ist zu kurz.`),
        new ValidationMessage('valueHasNotChanged', 'Die URL hat sich nicht geändert.')
      ]
    }
  }

  get instagramUrlformControl(): AbstractControl {
    return this.form.controls.instagramUrl;
  }

  get facebookUrlformControl(): AbstractControl {
    return this.form.controls.facebookUrl;
  }

  get youtubeUrlformControl(): AbstractControl {
    return this.form.controls.youtubeUrl;
  }

  get tiktokUrlformControl(): AbstractControl {
    return this.form.controls.tiktokUrl;
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
    this.analyticsService.setFirebaseScreenName('profile_settings-creator-social_media_links');
  }

  saveChanges() {
    if (this.form.invalid) {
      this.showNoChangesMessage = false;
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    if (this.form.untouched) {
      this.showNoChangesMessage = true;
      return;
    }
    this.showNoChangesMessage = false;

    this.api.updateSocialMediaLinks({
      instagramUrl: this.instagramUrlformControl.value,
      facebookUrl: this.facebookUrlformControl.value,
      youtubeUrl: this.youtubeUrlformControl.value,
      tiktokUrl: this.tiktokUrlformControl.value
    }).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: updatedAccount => {
        this.form.reset(updatedAccount.socialMediaLinks);
        this.userStore.updateCreatorAccount(updatedAccount);
        this.toastService.presentSuccessToast('Dein Name wurde erfolgreich aktualisiert.');
      },
      error: _ => {
        this.toastService.presentErrorToast('Dein Name konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
      },
    })
  }

  private async _setupForm() {

    const buildSocialMediaUrlControl = (url: string | undefined) => this.formBuilder.control(url, {
      validators: [
        Validators.pattern(CustomValidation.urlRegex),
        Validators.maxLength(this.URL_MAX_LENGTH),
        Validators.minLength(this.URL_MIN_LENGTH)
      ],
      updateOn: 'submit'
    });

    this.user = await this.userStore.loadUserProfile().toPromise();

    const socialMediaLinks = this.user.creatorAccount.socialMediaLinks;
    this.form = this.formBuilder.group({
      instagramUrl: buildSocialMediaUrlControl(socialMediaLinks.instagramUrl),
      facebookUrl: buildSocialMediaUrlControl(socialMediaLinks.facebookUrl),
      youtubeUrl: buildSocialMediaUrlControl(socialMediaLinks.youtubeUrl),
      tiktokUrl: buildSocialMediaUrlControl(socialMediaLinks.tiktokUrl)
    });
  }

}
