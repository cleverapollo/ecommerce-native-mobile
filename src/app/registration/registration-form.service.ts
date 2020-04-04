import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegistrationDto } from './registration-form';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFormService {

  private _form: BehaviorSubject<RegistrationDto> = new BehaviorSubject(new RegistrationDto());

  constructor() {}

  form$ = this._form.asObservable();
  updateDto(updatedForm: RegistrationDto) {
    this._form.next(updatedForm);
  }

}
