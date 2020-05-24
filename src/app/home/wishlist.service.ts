import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { WishListDto } from '../shared/models/wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private apiService: ApiService) { }

  getWishLists(forView: string) : Observable<Array<WishListDto>> {
    const params = new HttpParams().set('view', forView);
    return this.apiService.get(`wish-list`, params)
  }
}
