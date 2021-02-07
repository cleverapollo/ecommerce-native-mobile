import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfileStore } from '../../user-profile-store.service';
import { Subscription } from 'rxjs';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from '@shared/components/hint/hint.component';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-last-name-update',
  templateUrl: './last-name-update.page.html',
  styleUrls: ['./last-name-update.page.scss'],
})
export class LastNameUpdatePage implements OnInit, OnDestroy {

  private subscription: Subscription

  form: FormGroup;

  get validationMessages(): ValidationMessages {
    return {
      lastName: [
        new ValidationMessage('required', 'Gib bitte deinen Nachnamen an.'),
        new ValidationMessage('minlength', 'Dein Nachname muss aus mindestens zwei Zeichen bestehen.')
      ],
    }
  }

  constructor(
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private userProfileStore: UserProfileStore,
    private loadingService: LoadingService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.subscription = this.userProfileStore.loadUserProfile().subscribe( userProfile => {
      const lastName = userProfile.lastName ? userProfile.lastName : "";
      this.form = this.formBuilder.group({
        lastName: this.formBuilder.control(lastName, [Validators.required, Validators.min(2)])
      });
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  saveChanges() {
    this.loadingService.showLoadingSpinner();
    this.api.partialUpdateLastName(this.form.controls.lastName.value).toPromise()
      .then( updatedProfile => {
        this.userProfileStore.updateCachedUserProfile(updatedProfile);
        this.toastService.presentSuccessToast('Dein Nachname wurde erfolgreich aktualisiert.');
      })
      .catch( error => {
        this.toastService.presentErrorToast('Dein Nachname konnte nicht aktualisiert werden. Bitte versuche es später noch einmal.');
      })
      .finally(() => {
        this.loadingService.dismissLoadingSpinner();
      })
  }

}
