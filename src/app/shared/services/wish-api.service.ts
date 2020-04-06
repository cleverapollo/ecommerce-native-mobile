import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishApiService {

  constructor(private apiService: ApiService) { }

  purchase(wishId: Number) : Observable<Object> {
    return this.apiService.patch(`wish/${wishId}/purchase`);
  }

}
