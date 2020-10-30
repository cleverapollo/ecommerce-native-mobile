import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { SearchResultItem } from '../models/search-result-item';
import { Observable } from 'rxjs';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private static REST_END_POINT = 'search';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  searchForItems(keywords: String): Observable<Array<SearchResultItem>> {
    return this.apiService.get<Array<SearchResultItem>>(`${SearchService.REST_END_POINT}/${keywords}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }
}
