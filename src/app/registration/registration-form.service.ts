import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegistrationDto, RegistrationRequest } from './registration-form';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFormService {

  private _form: BehaviorSubject<RegistrationRequest> = new BehaviorSubject(null);

  constructor() {}

  form$ = this._form.asObservable();
  updateDto(updatedForm: RegistrationRequest) {
    this._form.next(updatedForm);
  }

}
