import { Injectable } from '@angular/core';
import { RegistrationRequest } from '@core/models/registration.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFormService {

  private _form: BehaviorSubject<RegistrationRequest> = new BehaviorSubject(new RegistrationRequest());

  constructor() {}

  form$ = this._form.asObservable();
  updateDto(updatedForm: RegistrationRequest) {
    this._form.next(updatedForm);
  }

  set date(date: Date) {
    this._form.value.wishList.date = date;
  }

}
