import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationMessage } from './validation-message';

@Component({
  selector: 'app-validation-messages',
  templateUrl: './validation-messages.component.html',
  styleUrls: ['./validation-messages.component.scss'],
})
export class ValidationMessagesComponent implements OnInit {

  @Input() control: FormControl
  @Input() validationMessages: [ValidationMessage]

  constructor() { }

  ngOnInit() {
  }

}
