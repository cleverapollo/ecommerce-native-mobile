import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WishListDto, WishDto } from '../models/wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  private _selectedWishList: BehaviorSubject<WishListDto> = new BehaviorSubject(new WishListDto());
  private _selectedWish: BehaviorSubject<WishDto> = new BehaviorSubject(new WishDto());

  constructor() {}

  selectedWishList$ = this._selectedWishList.asObservable();
  selectedWish$ = this._selectedWish.asObservable();

  updateSelectedWishList(wishList: WishListDto) {
    this._selectedWishList.next(wishList);
  }

  updateSelectedWish(wish: WishDto) {
    this._selectedWish.next(wish);
  }
}
