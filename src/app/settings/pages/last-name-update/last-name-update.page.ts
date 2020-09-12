import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/components/validation-messages/validation-message';
import { UserApiService } from 'src/app/shared/api/user-api.service';
import { UserProfileDataService } from '../../user-profile-data.service';
import { Subscription } from 'rxjs';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from 'src/app/shared/components/hint/hint.component';

@Component({
  selector: 'app-last-name-update',
  templateUrl: './last-name-update.page.html',
  styleUrls: ['./last-name-update.page.scss'],
})
export class LastNameUpdatePage implements OnInit, OnDestroy {

  private subscription: Subscription

  form: FormGroup;
  showHint: Boolean;
  hintConfig: HintConfig

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
    private userProfileDataServer: UserProfileDataService
  ) { }

  ngOnInit() {
    this.showHint = false;
    this.subscription = this.userProfileDataServer.userProfile$.subscribe( userProfile => {
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
    this.api.partialUpdateLastName(this.form.controls.lastName.value).toPromise()
      .then( updatedProfile => {
        this.userProfileDataServer.updateUserProfile(updatedProfile);
        this.hintConfig = hintConfigForSuccessResponse;
      })
      .catch( e => {
        console.error(e);
        this.hintConfig = hintConfigForErrorResponse;
      })
      .finally(() => {
        this.showHint = true;
        setTimeout(() => {
          this.showHint = false;
        }, 3000);
      })
  }

}
