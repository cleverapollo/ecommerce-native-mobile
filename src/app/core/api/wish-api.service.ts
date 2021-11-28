import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { WishDto } from '@core/models/wish-list.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { ApiVersion } from './api-version';

export interface WishApi {
  createWish(wish: WishDto): Observable<WishDto>;
  getWishById(wishId: string) : Observable<WishDto>;
  reserveWish(wishId: string) : Observable<Object>;
  update(updatedWish: WishDto) : Observable<WishDto>;
}
@Injectable({
  providedIn: 'root'
})
export class WishApiService implements WishApi {

  private static REST_END_POINT = 'wishes';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  createWish(wish: WishDto): Observable<WishDto> {
    return this.apiService.post<WishDto>(`${ApiVersion.v1}/${WishApiService.REST_END_POINT}`, wish).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  getWishById(wishId: string) : Observable<WishDto> {
    return this.apiService.get<WishDto>(`${ApiVersion.v1}/${WishApiService.REST_END_POINT}/${wishId}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  reserveWish(wishId: string) : Observable<Object> {
    return this.apiService.patch(`${ApiVersion.v1}/${WishApiService.REST_END_POINT}/${wishId}/reserve`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  update(updatedWish: WishDto) : Observable<WishDto> {
    return this.apiService.put<WishDto>(`${ApiVersion.v1}/${WishApiService.REST_END_POINT}/${updatedWish.id}`, updatedWish).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
