import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { WishDto } from '@core/models/wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class WishApiService {

  constructor(private apiService: ApiService) { }

  createWish(wish: WishDto): Observable<WishDto> {
    return this.apiService.post<WishDto>('wish', wish);
  }

  getWishById(wishId: Number) : Observable<WishDto> {
    return this.apiService.get(`wish/${wishId}`);
  }

  purchase(wishId: Number) : Observable<Object> {
    return this.apiService.patch(`wish/${wishId}/purchase`);
  }

  update(updatedWish: WishDto) : Observable<WishDto> {
    return this.apiService.put<WishDto>(`wish/${updatedWish.id}`, updatedWish);
  }

}
