import { Injectable } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { EmailVerificationStatus } from '@core/models/user.model';
import { BehaviorSubject } from 'rxjs';
import { LogService } from './log.service';
import { StorageKeys, StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {

  private _emailVerificationStatus = new BehaviorSubject<EmailVerificationStatus>(null);
  emailVerificationStatus = this._emailVerificationStatus.asObservable();

  constructor(
    private userApiService: UserApiService,
    private logger: LogService, 
    private storageService: StorageService
  ) { 
    this.initEmailVerificationStatus();
  }

  private initEmailVerificationStatus() {
    this.storageService.get<string>(StorageKeys.EMAIL_VERIFICATION_STATUS).then( status => {
      this._emailVerificationStatus.next(EmailVerificationStatus[status]);
    });
  }

  updateEmailVerificationStatusIfNeeded() {
    const status = this._emailVerificationStatus.value
    if (status !== EmailVerificationStatus.VERIFIED) {
      this.userApiService.getEmailVerificationStatus().toPromise().then(emailVerification => {
        if (emailVerification.status !== status) {
          this.updateEmailVerificationStatus(emailVerification.status);
        }
      }, this.logger.error);
    }
  }

  updateEmailVerificationStatus(status: string | EmailVerificationStatus) {
    if (typeof status == 'string') {
      status = status as string;
      this._emailVerificationStatus.next(EmailVerificationStatus[status]);
      this.storageService.set(StorageKeys.EMAIL_VERIFICATION_STATUS, status);
    } else {
      status = status as EmailVerificationStatus;
      this._emailVerificationStatus.next(status);
      this.storageService.set(StorageKeys.EMAIL_VERIFICATION_STATUS, status.toString());
    }
  }

}
