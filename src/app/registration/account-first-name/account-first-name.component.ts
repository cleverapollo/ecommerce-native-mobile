import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-first-name',
  templateUrl: './account-first-name.component.html',
  styleUrls: ['./account-first-name.component.scss']
})
export class AccountFirstNameComponent implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'firstName': this.formBuilder.control('', [Validators.required])
    });
  }


}
