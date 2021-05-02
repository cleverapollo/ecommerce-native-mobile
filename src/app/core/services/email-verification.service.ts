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

  private _emailVerified = new BehaviorSubject<Boolean>(null);
  emailVerified = this._emailVerified.asObservable();

  constructor(
    private userApiService: UserApiService,
    private logger: LogService, 
    private storageService: StorageService,
  ) { }

  updateEmailVerificationStatus(isVerified: boolean) {
    this._emailVerified.next(isVerified);
  }

}
