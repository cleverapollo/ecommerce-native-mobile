import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserProfile, UploadFileResponse, UserSearchResult } from '@core/models/user.model';
import { UpdatePasswordRequest, ChangePasswordRequest } from '@core/models/login.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private static REST_END_POINT = 'user';

  constructor(private apiService: ApiService, private errorHandler: ApiErrorHandlerService) { }

  getProfile(): Observable<UserProfile> {
    return this.apiService.get<UserProfile>(`${UserApiService.REST_END_POINT}/profile`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateFirstName(firstName: string): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${UserApiService.REST_END_POINT}/profiles/firstname`, { firstName: firstName }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ); 
  }

  partialUpdateLastName(lastName: string): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${UserApiService.REST_END_POINT}/profiles/lastname`, { lastName: lastName }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ); 
  }

  partialUpdateBirthday(birthday: Date): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${UserApiService.REST_END_POINT}/profiles/birthday`, { birthday: birthday }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateEmail(email: string): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${UserApiService.REST_END_POINT}/profiles/email`, { email: email }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  resetPassword(email: string) {
    return this.apiService.post(`${UserApiService.REST_END_POINT}/reset-password`, { email: email}).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ); 
  }

  updatePassword(updatePasswordRequest: UpdatePasswordRequest): Observable<Object> {
    return this.apiService.put(`${UserApiService.REST_END_POINT}/update-password`, updatePasswordRequest).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  changePassword(changewPasswordRequest: ChangePasswordRequest): Observable<Object> {
    return this.apiService.post(`${UserApiService.REST_END_POINT}/change-password`, changewPasswordRequest).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  uploadFile(request) : Observable<UploadFileResponse> {
    return this.apiService.post<UploadFileResponse>(`${UserApiService.REST_END_POINT}/upload-profile-image`, request).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

}
