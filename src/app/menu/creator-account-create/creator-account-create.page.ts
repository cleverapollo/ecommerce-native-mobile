import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { WanticError } from '@core/models/error.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { NavigationService } from '@core/services/navigation.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { iife } from '@shared/helpers/common.helper';
import { lastValueFrom } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { TabBarRoute, getTaBarPath } from 'src/app/tab-bar/tab-bar-routes';

@Component({
  selector: 'app-creator-account-create',
  templateUrl: './creator-account-create.page.html',
  styleUrls: ['./creator-account-create.page.scss'],
})
export class CreatorAccountCreatePage implements OnInit {

  private readonly NAME_MIN_LENGTH = 2;
  private readonly NAME_MAX_LENGTH = 63;
  private readonly USER_NAME_MIN_LENGTH = 2;
  private readonly USER_NAME_MAX_LENGTH = 31;
  private readonly DESCRIPTION_MIN_LENGTH = 10;
  private readonly DESCRIPTION_MAX_LENGTH = 150;
  private readonly URL_MAX_LENGTH = 2048;
  private readonly URL_MIN_LENGTH = 25;

  form: UntypedFormGroup;

  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Bitte gib einen Namen ein.'),
        new ValidationMessage('minlength', `Dein Name muss aus min. ${this.NAME_MIN_LENGTH} Zeichen bestehen.`),
        new ValidationMessage('maxlength', `Dein Name darf max. ${this.NAME_MAX_LENGTH} aus Zeichen bestehen.`)
      ],
      userName: [
        new ValidationMessage('required', 'Bitte gib einen Benutzername ein.'),
        new ValidationMessage('minlength', `Dein Benutzername muss aus mindestens ${this.USER_NAME_MIN_LENGTH} Zeichen bestehen.`),
        new ValidationMessage('maxlength', `Dein Benutzername darf max. ${this.USER_NAME_MAX_LENGTH} aus Zeichen bestehen.`)
      ],
      description: [
        new ValidationMessage('required', 'Bitte gib eine kurze Profilbeschreibung ein.'),
        new ValidationMessage('minlength', `Die Beschreibung muss aus mindestens ${this.DESCRIPTION_MIN_LENGTH} Zeichen bestehen.`),
        new ValidationMessage('maxlength', `Die Beschreibung darf max. ${this.DESCRIPTION_MAX_LENGTH} aus Zeichen bestehen.`)
      ],
      socialMediaUrl: [
        new ValidationMessage('pattern', 'Bitte gib eine gültige URL an.'),
        new ValidationMessage('maxlength', `Die URL ist zu lang.`),
        new ValidationMessage('minlength', `Die URL ist zu kurz.`)
      ],
    }
  }

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly analyticsService: AnalyticsService,
    private readonly userProfileStore: UserProfileStore,
    private readonly contentCreatorApi: ContentCreatorApiService,
    private readonly loadingService: LoadingService,
    private readonly toastService: CoreToastService,
    private readonly navService: NavigationService
  ) { }

  ngOnInit() {
    this._setupForm();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('creator_signup');
  }

  async createAccount() {
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    await this.loadingService.showLoadingSpinner();
    this.contentCreatorApi.createAccount({
      name: this.form.controls.name.value,
      userName: this.form.controls.userName.value,
      description: this.form.controls.description.value,
      socialMediaLinks: {
        instagramUrl: this.form.controls.instagramUrl.value,
        facebookUrl: this.form.controls.facebookUrl.value,
        youtubeUrl: this.form.controls.youtubeUrl.value,
        tiktokUrl: this.form.controls.tiktokUrl.value
      }
    }).pipe(
      first(),
      finalize(() => iife(this.loadingService.stopLoadingSpinner()))
    ).subscribe(({
      next: _ => iife(this._onSuccess()),
      error: error => iife(this._onError(error))
    }))
  }

  private async _onSuccess(): Promise<void> {
    await this.toastService.presentSuccessToast('Dein Creator Profil wurde erfolgreich erstellt.');
    await this.userProfileStore.toggleIsCreatorAccountActive();
    await this.userProfileStore.clearUserProfile();
    await this.navService.root(getTaBarPath(TabBarRoute.PRODUCT_LISTS, true));
  }

  private async _onError(error: any): Promise<void> {
    let message = 'Bei der Erstellung deines Profils ist ein Fehler aufgetreten.';
    if (error instanceof WanticError) {
      if (error.httpStatusCode === 409) {
        message = 'Der Benutzername ist bereits vergeben.'
      }
    }
    await this.toastService.presentErrorToast(message);
  }

  private async _setupForm() {

    const buildSocialMediaUrlControl = () => this.formBuilder.control(null, {
      validators: [
        Validators.pattern(CustomValidation.urlRegex),
        Validators.maxLength(this.URL_MAX_LENGTH),
        Validators.minLength(this.URL_MIN_LENGTH)
      ],
      updateOn: 'submit'
    });

    this.form = this.formBuilder.group({
      name: this.formBuilder.control(await this._getFullName(), {
        validators: [
          Validators.required,
          Validators.minLength(this.NAME_MIN_LENGTH),
          Validators.maxLength(this.NAME_MAX_LENGTH)
        ],
        updateOn: 'submit'
      }),
      userName: this.formBuilder.control(null, {
        validators: [
          Validators.required,
          Validators.minLength(this.USER_NAME_MIN_LENGTH),
          Validators.maxLength(this.USER_NAME_MAX_LENGTH)
        ],
        updateOn: 'submit'
      }),
      description: this.formBuilder.control(null, {
        validators: [
          Validators.required,
          Validators.minLength(this.DESCRIPTION_MIN_LENGTH),
          Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)
        ],
        updateOn: 'submit'
      }),
      instagramUrl: buildSocialMediaUrlControl(),
      facebookUrl: buildSocialMediaUrlControl(),
      youtubeUrl: buildSocialMediaUrlControl(),
      tiktokUrl: buildSocialMediaUrlControl()
    });
  }

  private async _getFullName(): Promise<string> {
    try {
      const userProfile = await lastValueFrom(this.userProfileStore.loadUserProfile());
      let fullName = userProfile.firstName;
      if (userProfile.lastName) {
        fullName += ` ${userProfile.lastName}`
      }
      return fullName;
    } catch (error) {
      return '';
    }
  }
}
