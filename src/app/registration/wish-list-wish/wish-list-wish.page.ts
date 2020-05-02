import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from 'src/app/shared/validation-messages/validation-message';

@Component({
  selector: 'app-wish-list-wish',
  templateUrl: './wish-list-wish.page.html',
  styleUrls: ['./wish-list-wish.page.scss'],
})
export class WishListWishPage implements OnInit {

  form: FormGroup
  validationMessages: ValidationMessages = {
    keywords: [
      new ValidationMessage('required', 'Gib bitte einen Suchbegriff ein.'),
    ],
  }

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private navController: NavController,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'keywords': this.formBuilder.control(null, [Validators.required])
    });
  }

  search() {
    this.router.navigate(['../search-results'], { 
      relativeTo: this.activatedRoute, 
      queryParams: { keywords: this.form.get('keywords').value } 
    });
  }

  goBack() {
    this.navController.back();
  }

}
