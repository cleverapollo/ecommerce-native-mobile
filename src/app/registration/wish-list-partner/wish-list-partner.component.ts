import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-wish-list-partner',
  templateUrl: './wish-list-partner.component.html',
  styleUrls: ['./wish-list-partner.component.scss']
})
export class WishListPartnerComponent implements OnInit {

  form: FormGroup

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'partner': this.formBuilder.control('', [Validators.email])
    });
  }

}
