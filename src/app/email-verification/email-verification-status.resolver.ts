import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Device, DeviceInfo } from '@capacitor/device';
import { GoogleApiService } from '@core/api/google-api.service';
import { UserApiService } from '@core/api/user-api.service';
import { VerifyEmailErrorCode, VerifyEmailResponse } from '@core/models/google-api.model';
import { PublicEmailVerificationStatus } from '@core/models/user.model';
import { AuthenticationService } from '@core/services/authentication.service';
import { Logger } from '@core/services/log.service';
import { CoreToastService } from '@core/services/toast.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class EmailVerificationStatusResolver implements Resolve<
  Promise<PublicEmailVerificationStatus> | Observable<PublicEmailVerificationStatus>
> {

  private deviceInfo: DeviceInfo;

  constructor(
    private userApiService: UserApiService,
    private googleApiService: GoogleApiService,
    private authService: AuthenticationService,
    private toastService: CoreToastService,
    private router: Router,
    private logger: Logger
  ) {
    this.init();
  }

  async init() {
    this.deviceInfo = await Device.getInfo();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // verify wantic email v1.0.x
    const emailVerificationToken = route.queryParamMap.get('emailVerificationToken');
    if (emailVerificationToken) {
      return this.verifyWanticEmail(emailVerificationToken);
    }

    // verify google email v1.1.x +
    const oobCode = route.queryParamMap.get('oobCode');
    if (oobCode) {
      return this.verifyGoogleEmail(oobCode);
    }

    return Promise.resolve(PublicEmailVerificationStatus.ERROR);
  }

  private verifyWanticEmail(emailVerificationToken: string): Promise<PublicEmailVerificationStatus> {
    return this.userApiService.verifyEmail(emailVerificationToken);
  }

  private verifyGoogleEmail(oobCode: string): Observable<PublicEmailVerificationStatus> {
    this.logger.debug('oobCode, mode', oobCode);
    if (oobCode != null) {
      return this.googleApiService.verifyEmail(oobCode).pipe(
        map(response => {
          return this.handleSuccessResponse(response);
        }),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.getErrorMessage(error);
          const emailVerificationErrorCode = VerifyEmailErrorCode[errorMessage];
          if (emailVerificationErrorCode === VerifyEmailErrorCode.INVALID_OOB_CODE) {
            return of(PublicEmailVerificationStatus.EMAIL_ALREADY_CONFIRMED);
          } else if (emailVerificationErrorCode === VerifyEmailErrorCode.EXPIRED_OOB_CODE) {
            return of(PublicEmailVerificationStatus.TOKEN_EXPIRED);
          }
          return of(PublicEmailVerificationStatus.ERROR);
        })
      );
    } else {
      return of(null);
    }
  }

  private handleSuccessResponse(response: VerifyEmailResponse): PublicEmailVerificationStatus {
    if (this.deviceInfo.platform === 'ios' || this.deviceInfo.platform === 'android') {
      if (response?.emailVerified) {
        this.authService.updateEmailVerificationStatus(response.emailVerified);
      }
      this.toastService.presentSuccessToast('Deine E-Mail-Adresse wurde erfolgreich bestätigt.');
      this.router.navigateByUrl('/secure/home/wish-list-overview');
      return PublicEmailVerificationStatus.VERIFIED;
    } else {
      return PublicEmailVerificationStatus.VERIFIED;
    }
  }

  private getErrorMessage(httpError: HttpErrorResponse) {
    let errorMessage = httpError.message;
    if (typeof httpError.error === 'string') {
      const googleApiError = JSON.parse(httpError.error);
      if (googleApiError?.error?.message) {
        errorMessage = googleApiError?.error?.message;
      }
    } else if (typeof httpError.error === 'object') {
      const googleApiError = httpError.error.error;
      if (googleApiError?.message) {
        errorMessage = googleApiError?.message;
      }
    }
    return errorMessage;
  }
}