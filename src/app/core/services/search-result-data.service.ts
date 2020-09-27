import { Injectable } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchResultDataService {

  private _lastSearchResults: BehaviorSubject<SearchResultItem[]> = new BehaviorSubject([]);
  $lastSearchResults = this._lastSearchResults.asObservable();

  private _lastSearchTerm: BehaviorSubject<String> = new BehaviorSubject(null);
  $lastSearchTerm = this._lastSearchTerm.asObservable();

  constructor() { }

  update(items: SearchResultItem[]) {
    this._lastSearchResults.next(items);
  }

  updateSearchTerm(searchTerm: String) {
    this._lastSearchTerm.next(searchTerm);
  }

  clear() {
    this._lastSearchResults.next([]);
  }

}
