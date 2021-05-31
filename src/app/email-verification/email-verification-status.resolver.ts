import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GoogleApiService } from '@core/api/google-api.service';
import { UserApiService } from '@core/api/user-api.service';
import { UserManagementActionMode, VerifyEmailErrorCode, VerifyEmailResponse } from '@core/models/google-api.model';
import { PublicEmailVerificationStatus } from '@core/models/user.model';
import { AuthenticationService } from '@core/services/authentication.service';
import { LogService } from '@core/services/log.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DeviceInfo, Plugins } from '@capacitor/core'
import { ToastService } from '@core/services/toast.service';
import { StorageKeys, StorageService } from '@core/services/storage.service';

const { Device } = Plugins
@Injectable()
export class EmailVerificationStatusResolver implements Resolve<Promise<PublicEmailVerificationStatus> | Observable<PublicEmailVerificationStatus>> {
  
  private deviceInfo: DeviceInfo;
  
  constructor(
    private userApiService: UserApiService, 
    private googleApiService: GoogleApiService, 
    private authService: AuthenticationService,
    private toastService: ToastService,
    private router: Router,
    private logger: LogService,
    private storageService: StorageService
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
    const mode = route.queryParamMap.get('mode');
    if (oobCode && mode) {
      return this.verifyGoogleEmail(oobCode, mode);
    }

    return Promise.resolve(PublicEmailVerificationStatus.ERROR);
  }

  private verifyWanticEmail(emailVerificationToken: string) {
    return this.userApiService.verifyEmail(emailVerificationToken);
  }

  private verifyGoogleEmail(oobCode: string, mode: string): Observable<PublicEmailVerificationStatus> {
    const action: UserManagementActionMode = UserManagementActionMode[mode];
    this.logger.debug('oobCode, mode', oobCode, mode);
    if (action === UserManagementActionMode.verifyEmail && oobCode != null) {
      return this.googleApiService.verifyEmail(oobCode).pipe(
        map( response => {
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
      if (response && response.emailVerified != null) {
        const userInfo = this.authService.userInfo.value;
        userInfo.emailVerified = response.emailVerified;
        this.authService.userInfo.next(userInfo);
        this.storageService.set(StorageKeys.FIREBASE_EMAIL_VERIFIED, response.emailVerified, true);
      }
      this.toastService.presentSuccessToast('Deine E-Mail-Adresse wurde erfolgreich bestätigt.');
      this.router.navigateByUrl('/secure/home/wish-list-overview');
      return PublicEmailVerificationStatus.VERIFIED;
    } else {
      return PublicEmailVerificationStatus.VERIFIED;
    }
  }

  private getErrorMessage(error: HttpErrorResponse) {
    let errorMessage = error.message;
    if (typeof error.error === 'string') {
      const googleApiError = JSON.parse(error.error);
      if (googleApiError?.error?.message) {
        errorMessage = googleApiError?.error?.message;
      }
    }
    return errorMessage;
  }
}