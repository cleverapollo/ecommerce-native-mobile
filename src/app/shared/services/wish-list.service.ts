import { Injectable } from '@angular/core';
import { Wish } from 'src/app/home/wishlist.model';
import { BehaviorSubject } from 'rxjs';
import { WishListDto } from '../models/wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  private _selectedWishList: BehaviorSubject<WishListDto> = new BehaviorSubject(new WishListDto());
  private _selectedWish: BehaviorSubject<Wish> = new BehaviorSubject(new Wish());

  constructor() {}

  selectedWishList$ = this._selectedWishList.asObservable();
  selectedWish$ = this._selectedWish.asObservable();

  updateSelectedWishList(wishList: WishListDto) {
    this._selectedWishList.next(wishList);
  }

  updateSelectedWish(wish: Wish) {
    this._selectedWish.next(wish);
  }
}
