import { Injectable } from '@angular/core';
import { WishList } from 'src/app/home/wishlist.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  private _selectedWishList: BehaviorSubject<WishList> = new BehaviorSubject(new WishList());

  constructor() {}

  selectedWishList$ = this._selectedWishList.asObservable();
  updateSelectedWishList(wishList: WishList) {
    this._selectedWishList.next(wishList);
  }
}
