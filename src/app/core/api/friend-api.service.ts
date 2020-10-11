import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { FriendSelectOption } from '@core/models/friend.model';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

@Injectable({
  providedIn: 'root'
})
export class FriendApiService {

  constructor(private apiService: ApiService) { }

  query(view: 'SELECTION') : Observable<Array<FriendSelectOption>> {
    const params = new HttpParams().set('view', view);
    return this.apiService.get(`friend`, params);
  }

  getWishListById(id: Number): Observable<FriendWishList> {
    return this.apiService.get(`friend/wish-lists/${id}`);
  }

}
