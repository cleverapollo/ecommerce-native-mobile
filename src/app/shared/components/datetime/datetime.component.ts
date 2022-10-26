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

  @ViewChild('modalDatetime') datetime?: IonDatetime;

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
  value: null | string | string[] | undefined;
  isModalOpen: boolean = false;

  // ISO 8601 datetime string
  get selectedDate(): null | string | string[] | undefined {
    return this._selectedDate;
  }

  set selectedDate(isoDateString: null | string | string[] | undefined) {

    this._selectedDate = isoDateString;
    this.propagateChange(this._selectedDate);

    if (typeof isoDateString === 'string' && isoDateString) {
      this.formattedDate = isoDateString ?
        format(parseISO(isoDateString), 'dd.MM.yyyy') :
        isoDateString;
      this.value = isoDateString;
    }

    if (!isoDateString) {
      this.formattedDate = '';
      this.setDefaultValue();
    }
  }

  private _selectedDate: null | string | string[] | undefined;

  constructor() { }

  ngOnInit(): void {
    this.setDefaultValue();
  }

  clearInput() {
    this.selectedDate = null;
    this.setDefaultValue();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmValue() {
    this.datetime?.confirm(true).then(() => {
      this.selectedDate = this.value;
      this.isModalOpen = false;
    });
  }

  private setDefaultValue() {
    if (this.selectedDate) {
      this.value = this.selectedDate;
    } else if (this.initialDate) {
      this.value = this.initialDate;
    } else if (this.minDate) {
      this.value = this.minDate;
    } else {
      this.value = new Date().toISOString();
    }
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
