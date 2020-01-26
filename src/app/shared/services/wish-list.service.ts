import { Injectable } from '@angular/core';
import { WishList, Wish } from 'src/app/home/wishlist.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  private _selectedWishList: BehaviorSubject<WishList> = new BehaviorSubject(new WishList());
  private _selectedWish: BehaviorSubject<Wish> = new BehaviorSubject(new Wish());

  constructor() {}

  selectedWishList$ = this._selectedWishList.asObservable();
  selectedWish$ = this._selectedWish.asObservable();

  updateSelectedWishList(wishList: WishList) {
    this._selectedWishList.next(wishList);
  }

  updateSelectedWish(wish: Wish) {
    this._selectedWish.next(wish);
  }
}
