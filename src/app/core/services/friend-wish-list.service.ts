import { Injectable } from '@angular/core';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { BehaviorSubject } from 'rxjs';
import { WishDto } from '@core/models/wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class FriendWishListService {

  private _selectedWishList: BehaviorSubject<FriendWishList> = new BehaviorSubject(new FriendWishList());
  private _selectedWish: BehaviorSubject<WishDto> = new BehaviorSubject(new WishDto());

  constructor() { }

  selectedWishList$ = this._selectedWishList.asObservable();
  selectedWish$ = this._selectedWish.asObservable();

  updateSelectedWishList(wishList: FriendWishList) {
    this._selectedWishList.next(wishList);
  }

  updateSelectedWish(wish: WishDto) {
    this._selectedWish.next(wish);
  }

}
