import { Component, OnInit, Input } from '@angular/core';
import { FriendWish } from 'src/app/friends-wish-list-overview/friends-wish-list-overview.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';

@Component({
  selector: 'app-give-shared-wish-modal',
  templateUrl: './give-shared-wish-modal.component.html',
  styleUrls: ['./give-shared-wish-modal.component.scss'],
})
export class GiveSharedWishModalComponent implements OnInit {

  @Input() wish: FriendWish

  form: FormGroup;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
    ]
  }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
    })
  }

}
