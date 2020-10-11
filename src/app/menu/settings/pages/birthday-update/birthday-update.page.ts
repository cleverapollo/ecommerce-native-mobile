import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '@core/api/user-api.service';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from '@shared/components/hint/hint.component';
import { UserProfileDataService } from '../../user-profile-data.service';

@Component({
  selector: 'app-birthday-update',
  templateUrl: './birthday-update.page.html',
  styleUrls: ['./birthday-update.page.scss'],
})
export class BirthdayUpdatePage implements OnInit {

  showHint: Boolean;
  hintConfig: HintConfig;
  form: FormGroup;
  get validationMessages(): ValidationMessages {
    return {
      birthday: [
        new ValidationMessage('required', 'Gib bitte dein Geburtsdatum an.')
      ],
    }
  }

  constructor(
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private api: UserApiService, 
    private userProfileDataService: UserProfileDataService) 
  { }

  ngOnInit() {
    this.showHint = false;
    const birthday = history.state.data.profile.birthday;
    this.form = this.formBuilder.group({
      birthday: this.formBuilder.control(birthday, [Validators.required])
    });
  }

  saveChanges() {
    this.api.partialUpdateBirthday(this.form.controls.birthday.value).toPromise()
      .then(updatedProfile => {
        this.userProfileDataService.updateCachedUserProfile(updatedProfile);
        this.hintConfig = hintConfigForSuccessResponse;
      })
      .catch(e => {
        console.error(e);
        this.hintConfig = hintConfigForErrorResponse;
      })
      .finally(() => {
        this.showHint = true;
        setTimeout(() => {
          this.showHint = false;
        }, 3000);
      });
  }


}
