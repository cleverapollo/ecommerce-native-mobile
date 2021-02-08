import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserProfile, PublicEmailVerificationStatus } from '@core/models/user.model';
import { UpdatePasswordRequest, ChangePasswordRequest } from '@core/models/login.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { LogService } from '@core/services/log.service';
import { HttpStatusCodes } from '@core/models/http-status-codes';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private static REST_END_POINT = 'user';

  constructor(
    private apiService: ApiService, 
    private errorHandler: ApiErrorHandlerService,
    private logger: LogService
  ) { }

  deleteUser(): Observable<void> {
    return this.apiService.delete<void>(`${UserApiService.REST_END_POINT}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    )
  }

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

  partialUpdateProfileImage(formData: FormData): Observable<UserProfile> {
    return this.apiService.uploadFile<UserProfile>(`${UserApiService.REST_END_POINT}/profile-image`, formData).pipe(
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

  downloadProfileImage(url: string): Observable<Blob> {
    return this.apiService.downloadFile(url,).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  deleteProfileImage(fileName: string) {
    return this.apiService.delete(`${UserApiService.REST_END_POINT}/profile-image/${fileName}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  verifyEmail(emailVerficationToken: string): Promise<PublicEmailVerificationStatus> {
    return new Promise((resolve) => {
      return this.apiService.patch<void>(`${UserApiService.REST_END_POINT}/email-verification`, { emailVerficationToken: emailVerficationToken }).toPromise().then(() => {
        resolve(PublicEmailVerificationStatus.VERIFIED);
      }, error => {
        if (error.error instanceof ErrorEvent) {
          this.logger.log(`Error: ${error.error.message}`);
          resolve(PublicEmailVerificationStatus.ERROR);
        } else {
          this.logger.log(`error status : ${error.status} ${error.statusText}`);
          if (error.status === HttpStatusCodes.UNAUTHORIZED) {
            resolve(PublicEmailVerificationStatus.TOKEN_EXPIRED);
          } else {
            resolve(PublicEmailVerificationStatus.ERROR);
          }
        }
      })
    });
  }

}
