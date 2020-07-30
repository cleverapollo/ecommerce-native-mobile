import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';
import { UserApiService } from 'src/app/shared/api/user-api.service';

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

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private api: UserApiService) { }

  ngOnInit() {
    const firstName = this.route.snapshot.data.profile.firstName;
    this.form = this.formBuilder.group({
      firstName: this.formBuilder.control(firstName, [Validators.required, Validators.min(2)])
    });
  }

  saveChanges() {
    this.api.partialUpdateFirstName(this.form.controls.firstName.value).toPromise().then( updatedProfile => {
      console.log(updatedProfile);
    }, e => console.error);
  }

}
