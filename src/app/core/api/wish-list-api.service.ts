import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WishListCreateRequest, WishListUpdateRequest } from '@wishLists/wish-list-create-update/wish-list-create-update.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { WishListDto, WishDto, WishListSelectOptionDto } from '@core/models/wish-list.model';
import { SharedWishListDto, RegisterAndSatisfyWishRequest } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

@Injectable({
  providedIn: 'root'
})
export class WishListApiService {

  constructor(private apiService: ApiService) { }

  create(wishList: WishListCreateRequest) : Observable<Object> {
    return this.apiService.post('wish-list', wishList);
  }

  getWishLists(forView: string) : Observable<Array<WishListDto>> {
    const params = new HttpParams().set('view', forView);
    return this.apiService.get(`wish-list`, params)
  }

  getWishList(id: Number) : Observable<WishListDto> {
    return this.apiService.get(`wish-list/${id}`)
  }

  update(wishList: WishListUpdateRequest) : Observable<WishListDto> {
    return this.apiService.put<WishListDto>(`wish-list/${wishList.id}`, wishList);
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

  getLinkForSocialSharing(id: Number) : Observable<String> {
    return this.apiService.get(`wish-list/${id}/create-social-sharing-link`);
  }

  // shared wish list 

  getSharedWishList(identifier: string) : Observable<SharedWishListDto> {
    const params = new HttpParams().set('identifier', identifier);
    return this.apiService.get('shared-wish-list', params);
  }

  registerAndSatisfyWish(data: RegisterAndSatisfyWishRequest) : Observable<SharedWishListDto> {
    return this.apiService.post('shared-wish-list', data) as  Observable<SharedWishListDto>;
  }
  
}
