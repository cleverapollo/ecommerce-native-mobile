import { Injectable } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { PriceDto } from '@core/models/wish-list.model';

export class URLSearchFormData {
  imageUrl: String;
  name: string;
  price: PriceDto;
  wishListId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UrlSearchDataStoreService {

  searchResultItem?: SearchResultItem;
  formData: URLSearchFormData;

  constructor() { 
    this.reset();
  }

  reset() {
    this.formData = new URLSearchFormData();
  }
}
