import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { SearchResultItem } from '../models/search-result-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private apiService: ApiService) { }

  searchForItems(keywords: String) : Observable<Array<SearchResultItem>> {
    return this.apiService.get<Array<SearchResultItem>>(`search/${keywords}`);
  }
}