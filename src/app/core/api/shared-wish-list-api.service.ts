import { Injectable } from '@angular/core';
import { FriendWishList } from '@core/models/wish-list.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SharedWishListApiService {

  private static REST_END_POINT = 'shared-wish-lists';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  getWishLists(): Observable<FriendWishList[]> {
    return this.apiService.get<FriendWishList[]>(`${ApiVersion.v1}/${SharedWishListApiService.REST_END_POINT}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  getWishListById(id: string): Observable<FriendWishList> {
    return this.apiService.get<FriendWishList>(`${ApiVersion.v1}/${SharedWishListApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  removeWishListById(id: string): Observable<void> {
    return this.apiService.delete<void>(`${ApiVersion.v1}/${SharedWishListApiService.REST_END_POINT}/${id}/members`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
