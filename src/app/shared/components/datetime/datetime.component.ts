import { Component, forwardRef, Input, ViewChild } from '@angular/core';
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
export class DatetimeComponent implements ControlValueAccessor {

  @ViewChild(IonDatetime) datetime?: IonDatetime;

  /** Placeholder for the input */
  @Input() placeholder: string | undefined;
  /** Stacked label for the input. */
  @Input() label: string | undefined;
  /** Disables the date selection */
  @Input() disabled = false;
  /** Min Date to select. Earlier dates are disabled. */
  @Input() minDate: string | undefined;
  /** Max Date to select. Later dates are disabled. */
  @Input() maxDate: string | undefined;
  /** Date which is preselected in the modal. */
  @Input() initialDate: null | string | string[] | undefined;

  formattedDate: null | string | string[] | undefined;

  get value(): null | string | string[] | undefined {
    return this.selectedDate ?? this.initialDate ?? new Date().toISOString();
  }

  // ISO 8601 datetime string
  get selectedDate(): null | string | string[] | undefined {
    return this._selectedDate;
  }

  set selectedDate(isoDateString: null | string | string[] | undefined) {

    this._selectedDate = isoDateString;
    this.propagateChange(this._selectedDate);

    if (typeof isoDateString === 'string') {
      this.formattedDate = isoDateString ?
      format(parseISO(isoDateString), 'dd.MM.yyyy') :
      isoDateString;
    }
  }

  private _selectedDate: null | string | string[] | undefined;

  constructor() { }

  // ion-datetime

  onDateChanged(isoDateString: null | string | string[] | undefined) {
    this.selectedDate = isoDateString;
    this.datetime?.confirm(true);
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
