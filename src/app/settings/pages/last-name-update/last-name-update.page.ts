import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';
import { UserApiService } from 'src/app/shared/api/user-api.service';

@Component({
  selector: 'app-last-name-update',
  templateUrl: './last-name-update.page.html',
  styleUrls: ['./last-name-update.page.scss'],
})
export class LastNameUpdatePage implements OnInit {

  form: FormGroup;
  get validationMessages(): ValidationMessages {
    return {
      lastName: [
        new ValidationMessage('required', 'Gib bitte deinen Nachnamen an.'),
        new ValidationMessage('minlength', 'Dein Nachname muss aus mindestens zwei Zeichen bestehen.')
      ],
    }
  }

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private api: UserApiService) { }

  ngOnInit() {
    const lastName = this.route.snapshot.data.profile.lastName;
    this.form = this.formBuilder.group({
      lastName: this.formBuilder.control(lastName, [Validators.required, Validators.min(2)])
    });
  }

  saveChanges() {
    this.api.partialUpdateLastName(this.form.controls.lastName.value).toPromise().then( updatedProfile => {
      console.log(updatedProfile);
    }, e => console.error);
  }

}
