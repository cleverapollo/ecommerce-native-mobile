import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { ApiVersion } from './api-version';

@Injectable({
  providedIn: 'root'
})
export class SharedWishListApiService {

  private static REST_END_POINT = 'shared-wish-lists';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  getWishLists(): Observable<Array<FriendWishList>> {
    return this.apiService.get<Array<FriendWishList>>(`${ApiVersion.v1}/${SharedWishListApiService.REST_END_POINT}`).pipe(
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
