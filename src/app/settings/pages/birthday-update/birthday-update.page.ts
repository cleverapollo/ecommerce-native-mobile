import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from 'src/app/shared/api/user-api.service';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from 'src/app/shared/components/hint/hint.component';
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
    const birthday = this.route.snapshot.data.profile.birthday;
    this.form = this.formBuilder.group({
      birthday: this.formBuilder.control(birthday, [Validators.required])
    });
  }

  saveChanges() {
    this.api.partialUpdateBirthday(this.form.controls.birthday.value).toPromise()
      .then(updatedProfile => {
        this.userProfileDataService.updateUserProfile(updatedProfile);
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
