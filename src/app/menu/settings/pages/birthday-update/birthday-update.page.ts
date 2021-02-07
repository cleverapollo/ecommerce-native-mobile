import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '@core/api/user-api.service';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from '@shared/components/hint/hint.component';
import { UserProfileStore } from '../../user-profile-store.service';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';

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
        new ValidationMessage('required', 'Gib bitte dein Geburtsdatum an.')
      ],
    }
  }

  constructor(
    private loadingService: LoadingService, 
    private toastService: ToastService,
    private formBuilder: FormBuilder, 
    private api: UserApiService, 
    private userProfileStore: UserProfileStore) 
  { }

  ngOnInit() {
    const birthday = history.state.data.profile.birthday;
    this.form = this.formBuilder.group({
      birthday: this.formBuilder.control(birthday, [Validators.required])
    });
  }

  saveChanges() {
    this.loadingService.showLoadingSpinner();
    this.api.partialUpdateBirthday(this.form.controls.birthday.value).toPromise()
      .then(updatedProfile => {
        this.userProfileStore.updateCachedUserProfile(updatedProfile);
        this.toastService.presentSuccessToast('Dein Geburtsdatum wurde erfolgreich aktualisiert.');
      })
      .catch(e => {
        this.toastService.presentErrorToast('Dein Geburtsdatum konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
      })
      .finally(() => {
        this.loadingService.dismissLoadingSpinner();
      });
  }


}
