import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WishListCreate } from 'src/app/wish-list-new/wish-list-new.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListApiService {

  constructor(private apiService: ApiService) { }

  create(wishList: WishListCreate) : Observable<Object> {
    return this.apiService.post('wish-list', wishList)
  }

}
