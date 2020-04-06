import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserSearchResult } from './user-api.model';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private apiService: ApiService) { }

  searchUserByEmail(email: string) : Observable<UserSearchResult> {
    return this.apiService.get(`user/${email}/by-email`);
  }

  getProfile() : Observable<UserProfile> {
    return this.apiService.get(`user/profile`);
  }

  updateProfile(updatedProfile: UserProfile) : Observable<Object> {
    return this.apiService.put(`user/update-profile`, updatedProfile);
  }

}
