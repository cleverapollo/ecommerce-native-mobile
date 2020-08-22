import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserSearchResult, UpdatePasswordRequest, ResetPasswordRequest } from './user-api.model';
import { UserProfile, UploadFileResponse } from '../models/user.model';
import { ThrowStmt } from '@angular/compiler';

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

  partialUpdateFirstName(firstName: string): Observable<UserProfile> {
    return this.apiService.patch('user/profiles/firstname', { firstName: firstName }) as Observable<UserProfile>
  }

  partialUpdateLastName(lastName: string): Observable<UserProfile> {
    return this.apiService.patch('user/profiles/lastname', { lastName: lastName }) as Observable<UserProfile>
  }

  partialUpdateBirthday(birthday: Date): Observable<UserProfile> {
    return this.apiService.patch('user/profiles/birthday', { birthday: birthday }) as Observable<UserProfile>
  }

  partialUpdateEmail(email: string): Observable<UserProfile> {
    return this.apiService.patch('user/profiles/email', { email: email }) as Observable<UserProfile>
  }

  resetPassword(email: string) {
    return this.apiService.post('user/reset-password', { email: email}); 
  }

  updatePassword(updatePasswordRequest: UpdatePasswordRequest): Observable<Object> {
    return this.apiService.put(`user/update-password`, updatePasswordRequest);
  }

  updateProfile(updatedProfile: UserProfile) : Observable<Object> {
    return this.apiService.put(`user/update-profile`, updatedProfile);
  }

  uploadFile(request) : Observable<UploadFileResponse> {
    return this.apiService.post('user/upload-profile-image', request) as Observable<UploadFileResponse>;
  }

}
