import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wish-list-name',
  templateUrl: './wish-list-name.component.html',
  styleUrls: ['./wish-list-name.component.scss']
})
export class WishListNameComponent implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      'name': this.formBuilder.control('', [Validators.required])
    });
  }

}
