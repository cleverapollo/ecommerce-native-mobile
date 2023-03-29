import { Injectable } from '@angular/core';
import { ContentCreatorAccount } from '@core/models/content-creator.model';
import { WanticError } from '@core/models/error.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ContentCreatorApiService {

  private static REST_END_POINT = 'content-creators';

  constructor(private apiService: ApiService) { }

  createAccount(data: ContentCreatorAccount): Observable<string> {
    return this.apiService.postRaw<void>(`${ApiVersion.v1}/${ContentCreatorApiService.REST_END_POINT}`, data).pipe(
      catchError(error => throwError(new WanticError(error))),
      map(response => response.headers.get('Location'))
    );
  }

}
