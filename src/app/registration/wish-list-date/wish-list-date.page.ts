import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wish-list-date',
  templateUrl: './wish-list-date.page.html',
  styleUrls: ['./wish-list-date.page.scss']
})
export class WishListDatePage implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'date': this.formBuilder.control('', [Validators.required])
    });
  }

}
