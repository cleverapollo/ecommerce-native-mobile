import { Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { WishList } from './wishlist.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private apiService: ApiService) { }

  getWishLists(forView: string) : Observable<Array<WishList>> {
    const params = new HttpParams().set('view', forView);
    return this.apiService.get(`wish-list`, params)
  }
}
