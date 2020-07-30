import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from 'src/app/shared/api/user-api.service';

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

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private api: UserApiService) { }

  ngOnInit() {
    const birthday = this.route.snapshot.data.profile.birthday;
    this.form = this.formBuilder.group({
      birthday: this.formBuilder.control(birthday, [Validators.required])
    });
  }

  saveChanges() {
    this.api.partialUpdateBirthday(this.form.controls.birthday.value).toPromise().then( updatedProfile => {
      console.log(updatedProfile);
    }, e => console.error);
  }


}
