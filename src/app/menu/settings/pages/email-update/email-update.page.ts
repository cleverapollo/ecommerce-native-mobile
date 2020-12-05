import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '@core/api/user-api.service';
import { UserProfileStore } from '../../user-profile-store.service';
import { HintConfig, hintConfigForSuccessResponse, hintConfigForErrorResponse } from '@shared/components/hint/hint.component';
import { UserService } from '@core/services/user.service';
import { CustomValidation } from '@shared/custom-validation';

@Component({
  selector: 'app-email-update',
  templateUrl: './email-update.page.html',
  styleUrls: ['./email-update.page.scss'],
})
export class EmailUpdatePage implements OnInit {

  form: FormGroup;
  showHint: Boolean;
  hintConfig: HintConfig;
  initialValue: string;
  
  get validationMessages(): ValidationMessages {
    return {
      email: [
        new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
      ]
    }
  }

  constructor(
    private userService: UserService, 
    private formBuilder: FormBuilder, 
    private api: UserApiService,
    private userProfileStore: UserProfileStore) 
    { }

  ngOnInit() {
    const email = history.state.data.profile.email.value;
    this.initialValue = email;
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(email, [Validators.required, CustomValidation.email])
    });
  }

  unchanged(): boolean {
    return this.initialValue == this.form.controls['email'].value;
  }

  saveChanges() {
    this.api.partialUpdateEmail(this.form.controls.email.value).toPromise()
      .then(updatedProfile => {
        this.userService.updateEmailVerificationStatus(updatedProfile.email.status);
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
      });
  }

}
