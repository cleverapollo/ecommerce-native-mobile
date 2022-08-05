import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserProfile, PublicEmailVerificationStatus, EmailVerificationDto,
         UpdateEmailChangeRequest, AccountDto, Gender } from '@core/models/user.model';
import { UpdatePasswordRequest, ChangePasswordRequest, LoginResponse } from '@core/models/login.model';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Logger } from '@core/services/log.service';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { ApiVersion } from './api-version';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private static REST_END_POINT = 'users';

  constructor(
    private apiService: ApiService,
    private errorHandler: ApiErrorHandlerService,
    private logger: Logger
  ) { }

  deleteUser(): Observable<void> {
    return this.apiService.patch<void>(`${ApiVersion.v2}/${UserApiService.REST_END_POINT}/delete-account`);
  }

  getProfile(): Observable<UserProfile> {
    return this.apiService.get<UserProfile>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateFirebaseUid(uid: string): Observable<void> {
    return this.apiService.patch<void>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile/firebase-uid`, { uid }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateFirstName(firstName: string): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile/first-name`, {
      firstName
    }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateLastName(lastName: string): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile/last-name`, {
      lastName
    }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateBirthday(birthday: Date): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile/birthday`, {
      birthday
    }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateGender(gender: Gender): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile/gender`, {
      gender
    }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateEmail(emailVerficationToken: string): Observable<LoginResponse> {
    return this.apiService.patch<LoginResponse>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile/email`,  {
      emailVerficationToken
    });
  }

  updateEmailChangeRequest(requestBody: UpdateEmailChangeRequest): Observable<void> {
    return this.apiService.put<void>(`${ApiVersion.v2}/${UserApiService.REST_END_POINT}/profile/email`, requestBody).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateProfileImage(formData: FormData): Observable<UserProfile> {
    return this.apiService.uploadFile<UserProfile>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile-image`, formData).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  resetPassword(email: string) {
    return this.apiService.post(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/reset-password`, { email }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  updatePassword(updatePasswordRequest: UpdatePasswordRequest): Observable<any> {
    return this.apiService.put(`${ApiVersion.v2}/${UserApiService.REST_END_POINT}/update-password`, updatePasswordRequest).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  changePassword(changewPasswordRequest: ChangePasswordRequest): Observable<any> {
    return this.apiService.post(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/change-password`, changewPasswordRequest).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  downloadProfileImage(url: string): Observable<Blob> {
    return this.apiService.downloadFile(url,).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  deleteProfileImage(fileName: string) {
    return this.apiService.delete(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/profile-image/${fileName}`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  verifyEmail(emailVerficationToken: string): Promise<PublicEmailVerificationStatus> {
    return new Promise((resolve) => {
      return this.apiService.patch<void>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/email-verification`, {
        emailVerficationToken
      }).toPromise().then(() => {
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

  getEmailVerificationStatus(): Observable<EmailVerificationDto> {
    return this.apiService.get<EmailVerificationDto>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/email-verification`);
  }

  updateShowOnboardingSlidesIosState(state: boolean): Observable<void> {
    return this.apiService.patch<void>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/user-settings/show-onboarding-slides-ios`, {
      show: state
    });
  }

  updateShowOnboardingSlidesAndroidState(state: boolean): Observable<void> {
    return this.apiService.patch<void>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/user-settings/show-onboarding-slides-android`, {
      show: state
    });
  }

  getAccount(): Observable<AccountDto> {
    return this.apiService.get<AccountDto>(`${ApiVersion.v1}/${UserApiService.REST_END_POINT}/accounts`);
  }

}
