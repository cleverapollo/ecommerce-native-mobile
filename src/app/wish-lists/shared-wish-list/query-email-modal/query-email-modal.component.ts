import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';

@Component({
  selector: 'app-query-email-modal',
  templateUrl: './query-email-modal.component.html',
  styleUrls: ['./query-email-modal.component.scss'],
})
export class QueryEmailModalComponent implements OnInit {

  @Input() cachedEmail?: string;

  form: FormGroup;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.'),
    ]
  }

  get enteredEmail(): string {
    return this.form?.controls.email.value ?? '';
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(this.cachedEmail, [Validators.required, CustomValidation.email]),
    })
  }

  dismissModal() {
    this.modalController.dismiss(this.enteredEmail)
  }

}
