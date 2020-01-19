import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegistrationForm } from './registration-form';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFormService {

  private _form: BehaviorSubject<RegistrationForm> = new BehaviorSubject(new RegistrationForm());

  constructor() {}

  form$ = this._form.asObservable();
  updateForm(updatedForm: RegistrationForm) {
    this._form.next(updatedForm);
  }

}
