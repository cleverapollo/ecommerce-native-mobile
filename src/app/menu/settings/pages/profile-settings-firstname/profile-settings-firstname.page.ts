import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { UserApiService } from '@core/api/user-api.service';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from '@shared/components/hint/hint.component';
import { UserProfileStore } from '../../user-profile-store.service';

@Component({
  selector: 'app-profile-settings-firstname',
  templateUrl: './profile-settings-firstname.page.html',
  styleUrls: ['./profile-settings-firstname.page.scss'],
})
export class ProfileSettingsFirstnamePage implements OnInit {

  form: FormGroup;
  showHint: Boolean;
  hintConfig: HintConfig
  
  get validationMessages(): ValidationMessages {
    return {
      firstName: [
        new ValidationMessage('required', 'Gib bitte deinen Vornamen an.'),
        new ValidationMessage('minlength', 'Dein Vorname muss aus mindestens zwei Zeichen bestehen.')
      ],
    }
  }

  constructor(
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private userProfileStore: UserProfileStore) 
  { }

  ngOnInit() {
    const firstName = history.state.data.profile.firstName;
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control(firstName, [Validators.required, Validators.min(2)])
    });
  }

  saveChanges() {
    this.api.partialUpdateFirstName(this.form.controls.firstName.value).toPromise()
      .then(updatedProfile => {
        this.userProfileStore.updateCachedUserProfile(updatedProfile);
        this.hintConfig = hintConfigForSuccessResponse;
      })
      .catch(e => {
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
