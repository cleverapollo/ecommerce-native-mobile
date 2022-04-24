import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimeComponent),
      multi: true
    }
  ]
})
export class DatetimeComponent implements OnInit, ControlValueAccessor {

  @ViewChild(IonDatetime) datetime: IonDatetime;

  /** Placeholder for the input */
  @Input() placeholder: string | undefined;
  /** Stacked label for the input. */
  @Input() label: string | undefined;
  /** Disables the date selection */
  @Input() disabled: boolean = false;
  /** Min Date to select. Earlier dates are disabled. */
  @Input() minDate: string | undefined;
  /** Date which is preselected in the modal. */
  @Input() initialDate: null | string | undefined;

  formattedDate: string | null | undefined;

  // ISO 8601 datetime string
  get selectedDate(): null | string | undefined {
    return this._selectedDate;
  }

  set selectedDate(isoDateString: null | string | undefined) {

    this._selectedDate = isoDateString;    
    this.propagateChange(this._selectedDate);
    this.formattedDate = isoDateString ? 
      format(parseISO(isoDateString), 'dd.MM.yyyy') : 
      isoDateString;
  }

  private _selectedDate: string;

  constructor() { }

  ngOnInit() { }

  // ion-datetime

  onDateChanged(isoDateString: string) {
    this.selectedDate = isoDateString;
  }

  confirm() {
    this.datetime.confirm(true);
  }

  reset() {
    this.selectedDate = null;
    this.datetime.reset();
    this.datetime.cancel(true);
  }

  // ControlValueAccessor

  propagateChange = (_: any) => { };
  onTouched: any = (_: any) => { };

  writeValue(isoDate: string): void {
    this.selectedDate = isoDate;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
