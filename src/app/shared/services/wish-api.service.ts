import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { WishDto } from '../models/wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class WishApiService {

  constructor(private apiService: ApiService) { }

  purchase(wishId: Number) : Observable<Object> {
    return this.apiService.patch(`wish/${wishId}/purchase`);
  }

  update(updatedWish: WishDto) : Observable<Object> {
    return this.apiService.put(`wish/${updatedWish.id}`, updatedWish);
  }

}
