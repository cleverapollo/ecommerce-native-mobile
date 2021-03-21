import { Component, OnInit, Input } from '@angular/core';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { ModalController } from '@ionic/angular';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { PrivacyPolicyService } from '@core/services/privacy-policy.service';
import { CustomValidation } from '@shared/custom-validation';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';

@Component({
  selector: 'app-reserve-wish-modal',
  templateUrl: './reserve-wish-modal.component.html',
  styleUrls: ['./reserve-wish-modal.component.scss'],
})
export class ReserveWishModalComponent implements OnInit {

  @Input() wish: FriendWish
  @Input() wishList: FriendWishList;
  @Input() identifier: string;
  @Input() email?: string;

  form: FormGroup;
  wishReserved: boolean = false;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.'),
    ]
  }

  constructor(
    private storageService: StorageService,
    private formBuilder: FormBuilder, 
    private modalController: ModalController, 
    private publicResourceApiService: PublicResourceApiService,
    public privacyPolicyService: PrivacyPolicyService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(this.email, [Validators.required, CustomValidation.email]),
      acceptPrivacyPolicy: this.formBuilder.control(false, [Validators.requiredTrue])
    })
  }

  reserveWish() {
    const email = this.form.controls.email.value;
    const requestData = {
      wishListId: this.wishList.id, 
      email: email, 
      wishId: this.wish.id,
      agreedToPrivacyPolicyAt: new Date()
    };
    this.publicResourceApiService.registerUserAndReserveWish(requestData).toPromise().then( wishList => {
      this.wishList = wishList;
      this.storageService.set(StorageKeys.SHARED_WISH_LIST_EMAIL, email, true);
      this.wishReserved = true;
    })
  }

  closeModal() {
    this.modalController.dismiss(this.wishList);
  }

}
