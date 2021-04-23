import { Injectable } from '@angular/core';
import { SignupRequest } from '@core/models/signup.model';
import { StorageKeys, StorageService } from '@core/services/storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupStateService {

  private signupRequest: BehaviorSubject<SignupRequest> = new BehaviorSubject(new SignupRequest());

  constructor(private storageService: StorageService) { 
    this.loadCachedState();
  }

  private async loadCachedState() {
    const signupRequest = await this.storageService.get<SignupRequest>(StorageKeys.SIGNUP_REQUEST, true);
    if (signupRequest) {
      this.signupRequest.next(signupRequest);
    }
  }

  $signupRequest = this.signupRequest.asObservable();

  updateState(signupRequest: SignupRequest) {
    this.signupRequest.next(signupRequest);
    this.storageService.set(StorageKeys.SIGNUP_REQUEST, signupRequest, true);
  }

  removeState() {
    this.signupRequest.next(null);
    this.storageService.remove(StorageKeys.SIGNUP_REQUEST, true);
  }

}
