import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { SearchResult } from '../models/search-result-item';
import { Observable } from 'rxjs';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ApiVersion } from './api-version';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private static REST_END_POINT = 'searches';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  searchForItems(keywords: string, page: number): Observable<SearchResult> {
    const queryParams = new HttpParams()
      .set('keywords', keywords)
      .set('page', page.toString())
    return this.apiService.get<SearchResult>(`${ApiVersion.v1}/${SearchService.REST_END_POINT}`, queryParams).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }
}
