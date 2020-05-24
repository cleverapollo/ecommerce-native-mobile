import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { FriendSelectOption } from '../models/friend.model';

@Injectable({
  providedIn: 'root'
})
export class FriendApiService {

  constructor(private apiService: ApiService) { }

  query(view: 'SELECTION') : Observable<Array<FriendSelectOption>> {
    const params = new HttpParams().set('view', view);
    return this.apiService.get(`friend`, params);
  }

}
