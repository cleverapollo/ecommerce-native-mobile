import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListSelectOptionDto } from '@core/models/wish-list.model';
import { LogService } from '@core/services/log.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { WishListCreateRequest } from '@wishLists/wish-list-create-update/wish-list-create-update.model';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-wish-list-radio',
  templateUrl: './wish-list-radio.component.html',
  styleUrls: ['./wish-list-radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WishListRadioComponent),
      multi: true
    }
  ]
})
export class WishListRadioComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() _wishListId: string;

  @Input() initialValue: string;

  form: FormGroup;
  isEditMode = false;
  wishListSelectOptions: Array<WishListSelectOptionDto> = [];
  subscription: Subscription;

  private _requestIsRunning = false;

  get showSaveWishListButton(): boolean {
    return this.isEditMode && !this.requestIsRunning;
  }

  get showLoading(): boolean {
    return this.isEditMode && this.requestIsRunning;
  }

  get showForm(): boolean {
    return this.form && this.isEditMode;
  }

  get hasNoWishLists(): boolean {
    return this.wishListSelectOptions.length === 0;
  }

  get requestIsRunning(): boolean {
    return this._requestIsRunning;
  }
  set requestIsRunning(requestIsRunning: boolean) {
    this._requestIsRunning = requestIsRunning;
    if (requestIsRunning) {
      this.form?.controls.name.disable();
    } else {
      this.form?.controls.name.enable();
    }
  }

  get wishListId(): string {
    return this._wishListId;
  }

  set wishListId(wishListId: string) {
    this._wishListId = wishListId;
    this.propagateChange(this._wishListId);
  }

  constructor(
    private wishListStore: WishListStoreService,
    private wishListApi: WishListApiService,
    private formBuilder: FormBuilder,
    private logger: LogService
  ) {
  }

  ngOnInit() {
    this.form = this.initForm();
    this.initWishListSelectOptions();
  }

  private initWishListSelectOptions() {
    this.subscription = this.wishListStore.loadWishLists().subscribe(wishLists => {
      this.wishListSelectOptions = wishLists
        .map(wishList => WishListSelectOptionDto.forWishList(wishList))
        .sort(this.sortWishListsByName)
      if (this.initialValue) {
        this.wishListId = this.initialValue;
      } else {
        this.wishListId = this.wishListSelectOptions[0]?.id;
      }
    });
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      name: this.formBuilder.control('', {
        validators: [Validators.required]
      })
    })
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  writeValue(selectedOption: WishListSelectOptionDto | string): void {
    if (!selectedOption) {
      return;
    }

    if (selectedOption instanceof WishListSelectOptionDto) {
      this.wishListId = selectedOption.id;
    } else if (typeof selectedOption === 'string') {
      this.wishListId = selectedOption;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // no needed at this time
  }

  createNewWishList() {
    const nameControl = this.form.controls.name;
    if (nameControl.invalid) {
      return;
    }
    const request: WishListCreateRequest = {
      name: nameControl.value,
      showReservedWishes: false
    }
    this.requestIsRunning = true;
    this.wishListApi.create(request).pipe(first()).subscribe({
      next: wishList => {
        const newSelectOption = WishListSelectOptionDto.forWishList(wishList);
        this.wishListStore.clear().finally(() => {
          this.addWishListSelectOption(newSelectOption);

          this.wishListId = wishList.id;
          this.isEditMode = false;
          this.requestIsRunning = false;

          nameControl.reset();
        });
      },
      error: error => {
        this.logger.error(error);
        this.requestIsRunning = false;
      }
    });
  }

  private addWishListSelectOption(newSelectOption: WishListSelectOptionDto) {
    const clonedWishLists = [];
    this.wishListSelectOptions.forEach(val => clonedWishLists.push(Object.assign({}, val)));
    clonedWishLists.push(newSelectOption);
    clonedWishLists.sort(this.sortWishListsByName);
    this.wishListSelectOptions = clonedWishLists;
  }

  enableEditMode() {
    this.isEditMode = true;
  }

  private sortWishListsByName(wishListA: WishListSelectOptionDto, wishListB: WishListSelectOptionDto) {
    return wishListA.name.localeCompare(wishListB.name.toString());
  }

  propagateChange = (_: any) => {};
  onTouched: any = (_: any) => { };

}
