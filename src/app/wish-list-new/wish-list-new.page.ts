import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { WishListCreateRequest } from './wish-list-new.model';
import { WishListApiService } from '../shared/api/wish-list-api.service';
import { WishListService } from '../shared/services/wish-list.service';
import { NavController } from '@ionic/angular';
import { WishListDto } from '../shared/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '../shared/validation-messages/validation-message';

@Component({
  selector: 'app-wish-list-new',
  templateUrl: './wish-list-new.page.html',
  styleUrls: ['./wish-list-new.page.scss'],
})
export class WishListNewPage implements OnInit {

  form: FormGroup;
  
  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Vergib bitte einen Namen für deine Wunschliste.')
      ],
      date: [
        new ValidationMessage('required', 'Gib bitte ein Datum an, an welches deine Wunschliste gebunden ist.')
      ],
      partnerName: [],
      partnerEmail: [
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.')
      ],
    }
  };

  constructor(
    private formBuilder: FormBuilder, 
    private apiService: WishListApiService,
    private wishListService: WishListService,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'name': this.formBuilder.control('', [Validators.required]),
      'date': this.formBuilder.control('', [Validators.required]),
      'partner': this.formBuilder.group({
        'email': this.formBuilder.control('', [Validators.email]),
        'name': this.formBuilder.control('', []),
      })
    });
  }

  saveWishList() {
    let wishList = new WishListCreateRequest();
    wishList.name = this.form.controls.name.value;
    wishList.date = this.form.controls.date.value;
    wishList.partner = this.form.controls.partner.value;

    this.apiService.create(wishList).subscribe( (response : WishListDto) => {
      this.wishListService.updateSelectedWishList(response);
    }, console.error);
  }

  goBack() {
    this.navController.navigateBack('/home');
  }

}
