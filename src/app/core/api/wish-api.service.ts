import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { WishDto } from '@core/models/wish-list.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishApiService {

  private static REST_END_POINT = 'wish';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  createWish(wish: WishDto): Observable<WishDto> {
    return this.apiService.post<WishDto>(`${WishApiService.REST_END_POINT}`, wish).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  getWishById(wishId: Number) : Observable<WishDto> {
    return this.apiService.get<WishDto>(`${WishApiService.REST_END_POINT}/${wishId}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  purchase(wishId: Number) : Observable<Object> {
    return this.apiService.patch(`${WishApiService.REST_END_POINT}/${wishId}/purchase`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  update(updatedWish: WishDto) : Observable<WishDto> {
    return this.apiService.put<WishDto>(`${WishApiService.REST_END_POINT}/${updatedWish.id}`, updatedWish).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
