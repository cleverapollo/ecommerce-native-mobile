import { Component, OnInit, Input } from '@angular/core';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { ModalController } from '@ionic/angular';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-give-shared-wish-modal',
  templateUrl: './give-shared-wish-modal.component.html',
  styleUrls: ['./give-shared-wish-modal.component.scss'],
})
export class GiveSharedWishModalComponent implements OnInit {

  @Input() wish: FriendWish
  @Input() email?: string

  form: FormGroup;
  validationMessages: ValidationMessages = {
    email: [
      new ValidationMessage('required', 'Gib bitte deine E-Mail Adresse an.'),
      new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.'),
    ]
  }

  private STORAGE_KEY = 'SHARED_WISH_LIST_EMAIL';

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private formBuilder: FormBuilder, 
    private modalController: ModalController, 
    private wishListApiService: WishListApiService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(this.email, [Validators.required, Validators.email]),
    })
  }

  registerAndSatisfyWishRequest() {
    const email = this.form.controls.email.value;
    const requestData = {
      identifier: this.route.snapshot.queryParams.identifier, 
      email: email, 
      wishId: this.wish.id 
    };
    this.wishListApiService.registerAndSatisfyWish(requestData).toPromise().then( wishList => {
      this.storageService.set(this.STORAGE_KEY, email).finally(() => {
        this.modalController.dismiss(wishList);
      });
    })
  }

}
