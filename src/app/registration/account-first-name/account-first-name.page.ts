import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-first-name',
  templateUrl: './account-first-name.page.html',
  styleUrls: ['./account-first-name.page.scss']
})
export class AccountFirstNamePage implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'firstName': this.formBuilder.control('', [Validators.required])
    });
  }


}
