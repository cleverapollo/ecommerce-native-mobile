import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '../shared/components/validation-messages/validation-message';

@Component({
  selector: 'app-wish-list-guests',
  templateUrl: './wish-list-guests.page.html',
  styleUrls: ['./wish-list-guests.page.scss'],
})
export class WishListGuestsPage implements OnInit {

  guests: [] = [];

  newGuestForm: FormGroup
  validationMessages: ValidationMessages = {
    'displayName': [
      new ValidationMessage('required', 'Vergib bitte einen Anzeigenamen für deinen neuen Gast.'),
      new ValidationMessage('minlength', 'Der Anzeigename deines neuen Gastes muss mindestens aus zwei Buchstaben bestehen.'),
    ],
    'email': [
      new ValidationMessage('required', 'Gib bitte die E-Mail Adresse deines neuen Gastes an.'),
      new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
    ]
  }
  newGuests: [{ displayName: string, email: string }?] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.newGuestForm = this.formBuilder.group({
      'displayName': this.formBuilder.control('', [Validators.minLength(2), Validators.required]),
      'email': this.formBuilder.control('', [Validators.email, Validators.required]),
    });
  }

  addNewGuest() {
    this.newGuests.push({
      displayName: this.newGuestForm.controls.displayName.value,
      email: this.newGuestForm.controls.email.value
    });
    this.newGuestForm.reset();
  }

  deleteNewGuest(newGuest: { displayName: string, email: string }) {
    const newGuestIndex = this.newGuests.findIndex((guest) => { 
      return guest.email === newGuest.email; 
    });
    this.newGuests.splice(newGuestIndex, 1);
  }

  deleteGuest() {
    console.log('delete existing guest');
  }

  saveChanges() {
    console.log('save changes');
  }

}
