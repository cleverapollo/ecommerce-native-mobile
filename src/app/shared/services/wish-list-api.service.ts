import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WishListCreate } from 'src/app/wish-list-new/wish-list-new.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { WishListDto, WishDto, WishListSelectOptionDto } from '../models/wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class WishListApiService {

  constructor(private apiService: ApiService) { }

  create(wishList: WishListCreate) : Observable<Object> {
    return this.apiService.post('wish-list', wishList);
  }

  update(id: Number, wishList: WishListDto) : Observable<Object> {
    return this.apiService.put(`wish-list/${id}`, wishList);
  }

  delete(id: Number) : Observable<Object> {
    return this.apiService.delete(`wish-list/${id}`);
  }

  addWish(wish: WishDto) : Observable<Object> {
    return this.apiService.put(`wish-list/${wish.wishListId}/add-wish`, wish);
  }

  removeWish(wish: WishDto) : Observable<Object> {
    return this.apiService.delete(`wish-list/${wish.wishListId}/wish/${wish.id}`);
  }

  getWishListSelectOptions() : Observable<Array<WishListSelectOptionDto>> {
    const params = new HttpParams().set('view', 'SELECTION');
    return this.apiService.get(`wish-list`, params);
  }

}
