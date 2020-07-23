import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-update',
  templateUrl: './email-update.page.html',
  styleUrls: ['./email-update.page.scss'],
})
export class EmailUpdatePage implements OnInit {

  form: FormGroup;
  get validationMessages(): ValidationMessages {
    return {
      email: [
        new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
      ]
    }
  }

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit() {
    const email = this.route.snapshot.data.profile.email;
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(email, [Validators.required, Validators.email])
    });
  }

  saveChanges() {
    console.log('save changes');
  }

}
