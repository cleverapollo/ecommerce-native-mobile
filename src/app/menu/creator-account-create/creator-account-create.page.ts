import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { WanticError } from '@core/models/error.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { NavigationService } from '@core/services/navigation.service';
import { CoreToastService } from '@core/services/toast.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-creator-account-create',
  templateUrl: './creator-account-create.page.html',
  styleUrls: ['./creator-account-create.page.scss'],
})
export class CreatorAccountCreatePage implements OnInit {

  private readonly NAME_MIN_LENGTH = 2;
  private readonly USER_NAME_MIN_LENGTH = 2;
  private readonly DESCRIPTION_MIN_LENGTH = 10;

  form: FormGroup;

  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Bitte gib einen Namen ein.'),
        new ValidationMessage('minlength', `Dein Name muss aus mindestens ${this.NAME_MIN_LENGTH} Zeichen bestehen.`)
      ],
      userName: [
        new ValidationMessage('required', 'Bitte gib einen Benutzername ein.'),
        new ValidationMessage('minlength', `Dein Benutzername muss aus mindestens ${this.NAME_MIN_LENGTH} Zeichen bestehen.`)
      ],
      description: [
        new ValidationMessage('required', 'Bitte gib eine kurze Profilbeschreibung ein.'),
        new ValidationMessage('minlength', `Die Beschreibung muss aus mindestens ${this.NAME_MIN_LENGTH} Zeichen bestehen.`)
      ],
      socialMediaUrl: [
        new ValidationMessage('pattern', 'Bitte gib eine gültige URL an.')
      ],
    }
  }

  constructor(
    private readonly formBuilder: FormBuilder,
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
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe(({
      next: _ => {
        this.toastService.presentSuccessToast('Dein Creator Profil wurde erfolgreich erstellt.');
        this.userProfileStore.toggleIsCreatorAccountActive();
        this.userProfileStore.removeCachedUserProfile();
        this.navService.root('secure/product-list-overview')
      },
      error: error => {
        let message = 'Bei der Erstellung deines Profils ist ein Fehler aufgetreten.';
        if (error instanceof WanticError) {
          if (error.httpStatusCode === 409) {
            message = 'Der Benutzername ist bereits vergeben.'
          }
        }
        this.toastService.presentErrorToast(message);
      }
    }))
  }

  private async _setupForm() {

    const buildSocialMediaUrlControl = () => this.formBuilder.control(null, {
      validators: [Validators.pattern(CustomValidation.urlRegex)],
      updateOn: 'submit'
    });

    this.form = this.formBuilder.group({
      name: this.formBuilder.control(await this._getFullName(), {
        validators: [Validators.required, Validators.min(this.NAME_MIN_LENGTH)],
        updateOn: 'submit'
      }),
      userName: this.formBuilder.control('', {
        validators: [Validators.required, Validators.min(this.USER_NAME_MIN_LENGTH)],
        updateOn: 'submit'
      }),
      description: this.formBuilder.control('', {
        validators: [Validators.required, Validators.min(this.DESCRIPTION_MIN_LENGTH)],
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
      const userProfile = await this.userProfileStore.loadUserProfile().toPromise();
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
