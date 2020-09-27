import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

export interface StoredSelectedWishList {
  item: WishListDto;
  modifiedAt: Date;
}

export interface StoredSelectedWish {
  item: WishDto;
  modifiedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  private STORAGE_KEY_WISH_LIST = 'selected-wish-list';
  private STORAGE_KEY_WISH = 'selected-wish';

  private _selectedWishList: BehaviorSubject<WishListDto> = new BehaviorSubject(new WishListDto());
  private _selectedWish: BehaviorSubject<WishDto> = new BehaviorSubject(new WishDto());

  constructor(private storage: Storage, private platform: Platform) {
    this.platform.ready().then(() => {

      this.storage.get(this.STORAGE_KEY_WISH_LIST).then((storedWishListObject: StoredSelectedWishList) => {
        if (storedWishListObject) {
          this._selectedWishList.next(storedWishListObject.item);
        }
      });

      this.storage.get(this.STORAGE_KEY_WISH).then((storedWishObject: StoredSelectedWish) => {
        if (storedWishObject) {
          this._selectedWish.next(storedWishObject.item);
        }
      });

    });
  }

  // WISH LIST

  selectedWishList$ = this._selectedWishList.asObservable();

  updateSelectedWishList(wishList: WishListDto) {
    const itemToStore: StoredSelectedWishList = {
      item: wishList,
      modifiedAt: new Date()
    }
    this.storage.set(this.STORAGE_KEY_WISH_LIST, itemToStore);
    this._selectedWishList.next(wishList);
  }

  clearSelectedWishList() {
    this.storage.remove(this.STORAGE_KEY_WISH_LIST);
    this._selectedWishList.next(null);
  }

   // WISH 

  selectedWish$ = this._selectedWish.asObservable();

  updateSelectedWish(wish: WishDto) {
    const itemToStore: StoredSelectedWish = {
      item: wish,
      modifiedAt: new Date()
    }
    this.storage.set(this.STORAGE_KEY_WISH, itemToStore);
    this._selectedWish.next(wish);
  }

  clearSelectedWish() {
    this.storage.remove(this.STORAGE_KEY_WISH);
    this._selectedWish.next(null);
  }

}
