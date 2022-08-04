import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FriendWish, FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { BrowserService } from '@core/services/browser.service';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';
import { AffiliateLinkDebugInfoComponent } from '@shared/components/affiliate-link-debug-info/affiliate-link-debug-info.component';
import { StorageService } from '@core/services/storage.service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { first } from 'rxjs/operators';
import { CoreToastService } from '@core/services/toast.service';
import { WISH_ERROR_IMAGE_ASSET_URL } from '@core/ui.constants';

export enum SharedWishListState {
  CANCELLABLE, RESERVABLE, RESERVED, LOADING
}

@Component({
  selector: 'app-shared-wish',
  templateUrl: './shared-wish.component.html',
  styleUrls: ['./shared-wish.component.scss'],
})
export class SharedWishComponent implements OnInit {

  @Input() wish: FriendWish;
  @Input() wishList: FriendWishList;
  @Input() readonly = false;
  @Output() wishStateChanged: EventEmitter<FriendWish> = new EventEmitter<FriendWish>();

  state: SharedWishListState = SharedWishListState.LOADING;

  get isDebugInfoVisible(): boolean {
    return environment.backendType === BackendConfigType.beta ||
      environment.backendType === BackendConfigType.dev;
  }

  get cssClassWishReservedState(): string {
    if (this.state === SharedWishListState.RESERVED) {
      return 'wish-reserved';
    } else if (this.state === SharedWishListState.CANCELLABLE) {
      return 'wish-bought';
    }
    return null;
  }

  get isStateChangeable(): boolean {
    return this.isCancellable || this.isReservable;
  }

  get isReservable(): boolean {
    return this.state === SharedWishListState.RESERVABLE;
  }

  get isCancellable(): boolean {
    return this.state === SharedWishListState.CANCELLABLE;
  }

  get isLoading(): boolean {
    return this.state === SharedWishListState.LOADING;
  }

  private get cacheKey(): string {
    return `sharedWish_${this.wish?.id ?? '0'}`
  }

  constructor(
    private browserService: BrowserService,
    private modalController: ModalController,
    private storageService: StorageService,
    private publicResourceApiService: PublicResourceApiService,
    private toastService: CoreToastService,
  ) { }

  ngOnInit() {
    this.initState();
  }

  private initState() {
    if (this.wish.bought) {
      this.state = SharedWishListState.CANCELLABLE;
    } else if (this.wish.reservedByFriend) {
      this.storageService.get<boolean>(this.cacheKey).then(isReserved => {
        this.state = isReserved ? SharedWishListState.CANCELLABLE : SharedWishListState.RESERVED;
      }, () => {
        this.state = SharedWishListState.RESERVED;
      });
    } else {
      this.state = SharedWishListState.RESERVABLE;
    }
  }

  openProductURL() {
    const url = this.wish.productUrl; // affiliate link is created by backend service
    this.browserService.openInAppBrowser(url);
  }

  reserve() {
    this.state = SharedWishListState.LOADING;
    this.publicResourceApiService.reserveSharedWish(this.wish.wishListId, this.wish.id).pipe(first()).subscribe({
      next: updatedWish => {
        const message = this.createSuccessMessage();
        this.wish = updatedWish;
        this.state = SharedWishListState.CANCELLABLE;
        this.storageService.set(this.cacheKey, true);
        this.wishStateChanged.emit(updatedWish);
        this.toastService.presentSuccessToast(message);
      },
      error: () => {
        const message = 'Dein Wunsch konnte aufgrund eines Fehlers leider nicht reserviert werden.';
        this.toastService.presentErrorToast(message);
        this.state = SharedWishListState.RESERVABLE;
      }
    });
  }

  private createSuccessMessage(): string {
    const defaultMessage = 'Dein Geschenk ist nun für dich reserviert';
    let message = defaultMessage;
    if (this.wishList.owners.length && this.wishList.owners.length === 1) {
      const owner = this.wishList.owners[0];
      message = `Toll, dass du ${ owner.firstName }s Wunsch erfüllst. ${ owner.firstName } wird sich sehr freuen. ${defaultMessage}`;
    }
    return message;
  }

  cancelReservation() {
    this.state = SharedWishListState.LOADING;
    this.publicResourceApiService.cancelSharedWishReservation(this.wish.wishListId, this.wish.id).pipe(first()).subscribe({
      next: updatedWish => {
        const message = 'Wir haben deine Reservierung gelöscht.'
        this.wish = updatedWish;
        this.state = SharedWishListState.RESERVABLE;
        this.storageService.remove(this.cacheKey);
        this.wishStateChanged.emit(updatedWish);
        this.toastService.presentSuccessToast(message);
      },
      error: () => {
        const message = 'Deine Reservierung konnte aufgrund eines Fehlers leider nicht gelöscht werden.';
        this.toastService.presentErrorToast(message);
        this.state = SharedWishListState.CANCELLABLE;
      }
    })
  }

  imgOnErrorHandler(event) {
    event.target.src = WISH_ERROR_IMAGE_ASSET_URL;
 }

  async showDebugInfo() {
    const modal = await this.modalController.create({
      component: AffiliateLinkDebugInfoComponent,
      componentProps: {
        wish: this.wish
      },
      cssClass: 'wantic-modal',
    });
    await modal.present();
  }

}
