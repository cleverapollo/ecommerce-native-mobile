import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from '@shared/components/hint/hint.component';
import { UserProfileStore } from '../../user-profile-store.service';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-profile-settings-firstname',
  templateUrl: './profile-settings-firstname.page.html',
  styleUrls: ['./profile-settings-firstname.page.scss'],
})
export class ProfileSettingsFirstnamePage implements OnInit {

  form: FormGroup;
  
  get validationMessages(): ValidationMessages {
    return {
      firstName: [
        new ValidationMessage('required', 'Gib bitte deinen Vornamen an.'),
        new ValidationMessage('minlength', 'Dein Vorname muss aus mindestens zwei Zeichen bestehen.')
      ],
    }
  }

  constructor(
    private loadingService: LoadingService, 
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private userProfileStore: UserProfileStore,
    private toastService: ToastService) 
  { }

  ngOnInit() {
    const firstName = history.state.data.profile.firstName;
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control(firstName, [Validators.required, Validators.min(2)])
    });
  }

  saveChanges() {
    this.loadingService.showLoadingSpinner();
    this.api.partialUpdateFirstName(this.form.controls.firstName.value).toPromise()
      .then(updatedProfile => {
        this.userProfileStore.updateCachedUserProfile(updatedProfile);
        this.toastService.presentSuccessToast('Dein Vorname wurde erfolgreich aktualisiert.')
      })
      .catch(error => {
        this.toastService.presentErrorToast('Dein Vorname konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.')
      })
      .finally(() => {
        this.loadingService.dismissLoadingSpinner();
      })
  }

}
