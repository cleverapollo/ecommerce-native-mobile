import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-email-password',
  templateUrl: './account-email-password.component.html',
  styleUrls: ['./account-email-password.component.scss']
})
export class AccountEmailPasswordComponent implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit() {}

}
