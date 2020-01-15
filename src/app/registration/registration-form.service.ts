import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFormService {

  private _onButtonClicked: BehaviorSubject<() => void> = new BehaviorSubject(() => void { });
  private _valid: BehaviorSubject<Boolean> = new BehaviorSubject(true); 

  constructor() { }

  onButtonClicked$ = this._onButtonClicked.asObservable();
  changeButtonClickEvent(event: () => void) {
    this._onButtonClicked.next(event);
  }

  valid$ = this._valid.asObservable();
  changeValidState(state: Boolean) {
    this._valid.next(state);
  }

}
