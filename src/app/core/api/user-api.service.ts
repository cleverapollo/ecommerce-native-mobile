import { Injectable } from '@angular/core';
import { WanticError } from '@core/models/error.model';
import { HttpStatusCodes } from '@core/models/http-status-codes';
import { ChangePasswordRequest, LoginResponse, UpdatePasswordRequest } from '@core/models/login.model';
import {
  AccountDto,
  EmailDto,
  EmailVerificationDto,
  Gender,
  PublicEmailVerificationStatus,
  UpdateEmailChangeRequest,
  UserProfile
} from '@core/models/user.model';
import { Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private static REST_END_POINT = 'users';

  constructor(
    private apiService: ApiService,
    private errorHandler: ApiErrorHandlerService
  ) { }

  get apiV1(): string {
    return `${ApiVersion.v1}/${UserApiService.REST_END_POINT}`
  }

  get apiV2(): string {
    return `${ApiVersion.v2}/${UserApiService.REST_END_POINT}`
  }


  deleteUser(): Observable<void> {
    return this.apiService.patch<void>(`${this.apiV2}/delete-account`);
  }

  getProfile(): Observable<UserProfile> {
    return this.apiService.get<UserProfile>(`${this.apiV1}/profile`).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateFirebaseUid(uid: string): Observable<void> {
    return this.apiService.patch<void>(`${this.apiV1}/profile/firebase-uid`, { uid }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateFirstName(firstName: string): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${this.apiV1}/profile/first-name`, {
      firstName
    }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateLastName(lastName: string): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${this.apiV1}/profile/last-name`, {
      lastName
    }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateBirthday(birthday: Date): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${this.apiV1}/profile/birthday`, {
      birthday
    }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateGender(gender: Gender): Observable<UserProfile> {
    return this.apiService.patch<UserProfile>(`${this.apiV1}/profile/gender`, {
      gender
    }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  partialUpdateEmail(emailVerficationToken: string): Observable<LoginResponse> {
    return this.apiService.patch<LoginResponse>(`${this.apiV1}/profile/email`, {
      emailVerficationToken
    });
  }

  getImage(): Observable<Blob> {
    return this.apiService.downloadFile(`${this.apiV1}/profile/image`).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  getImageForUser(email: EmailDto): Observable<Blob> {
    return this.apiService.downloadFile(`${this.apiV1}/${email.value}/image`).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  async updateImage(file: ArrayBuffer): Promise<void> {
    try {
      return await lastValueFrom(this.apiService.uploadFile<void>(`${this.apiV1}/profile/image`, file));
    } catch (error) {
      throw new WanticError(error);
    }
  }

  deleteImage(): Observable<UserProfile> {
    return this.apiService.delete<UserProfile>(`${this.apiV1}/profile/image`).pipe(
      catchError(error => throwError(() => new WanticError(error)))
    );
  }

  updateEmailChangeRequest(requestBody: UpdateEmailChangeRequest): Observable<void> {
    return this.apiService.put<void>(`${this.apiV2}/profile/email`, requestBody).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  resetPassword(email: string) {
    return this.apiService.post(`${this.apiV1}/reset-password`, { email }).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  updatePassword(updatePasswordRequest: UpdatePasswordRequest): Observable<any> {
    return this.apiService.put(`${this.apiV2}/update-password`, updatePasswordRequest).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  changePassword(changewPasswordRequest: ChangePasswordRequest): Observable<any> {
    return this.apiService.post(`${this.apiV1}/change-password`, changewPasswordRequest).pipe(
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  async verifyEmail(emailVerficationToken: string): Promise<PublicEmailVerificationStatus> {
    try {
      await lastValueFrom(this.apiService.patch<void>(`${this.apiV1}/email-verification`, {
        emailVerficationToken
      }));
      return PublicEmailVerificationStatus.VERIFIED;
    } catch (error) {
      if (error?.status === HttpStatusCodes.UNAUTHORIZED) {
        return PublicEmailVerificationStatus.TOKEN_EXPIRED;
      }
      return PublicEmailVerificationStatus.ERROR
    }
  }

  getEmailVerificationStatus(): Observable<EmailVerificationDto> {
    return this.apiService.get<EmailVerificationDto>(`${this.apiV1}/email-verification`);
  }

  updateShowOnboardingSlidesIosState(state: boolean): Observable<void> {
    return this.apiService.patch<void>(`${this.apiV1}/user-settings/show-onboarding-slides-ios`, {
      show: state
    });
  }

  updateShowOnboardingSlidesAndroidState(state: boolean): Observable<void> {
    return this.apiService.patch<void>(`${this.apiV1}/user-settings/show-onboarding-slides-android`, {
      show: state
    });
  }

  getAccount(): Observable<AccountDto> {
    return this.apiService.get<AccountDto>(`${this.apiV1}/accounts`);
  }

}
