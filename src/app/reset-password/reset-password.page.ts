import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '../shared/components/validation-messages/validation-message';
import { UserApiService } from '../shared/api/user-api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  passwordResetRequestSuccessful: Boolean;

  form: FormGroup;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
    ]
  }

  constructor(private formBuilder: FormBuilder, private api: UserApiService) { }

  ngOnInit() {
    this.passwordResetRequestSuccessful = false;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  resetPassword() {
    console.log(this.form.controls.email.value)
    this.api.resetPassword(this.form.controls.email.value).toPromise().then(emptyResponse => {
      this.passwordResetRequestSuccessful = true;
    }, console.error);
  }

}
