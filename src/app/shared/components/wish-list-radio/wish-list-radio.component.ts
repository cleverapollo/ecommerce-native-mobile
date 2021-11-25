import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WishListSelectOptionDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { Subscription } from 'rxjs';

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

  @Input()
  _wishListId: string;

  @Input()
  initialValue: string;

  get wishListId(): string {
    return this._wishListId;
  }

  set wishListId(wishListId: string) {
    this._wishListId = wishListId;
    this.propagateChange(this._wishListId);
  }

  wishListSelectOptions: Array<WishListSelectOptionDto> = [];
  subscription: Subscription;

  propagateChange = (_: any) => {};
  onTouched: any = (_: any) => { };

  constructor(
    private wishListStore: WishListStoreService
  ) { }

  ngOnInit() {
    this.initWishListSelectOptions();
  }

  private initWishListSelectOptions() {
    this.subscription = this.wishListStore.loadWishLists().subscribe(wishLists => {
      this.wishListSelectOptions = wishLists
        .map(wishList => WishListSelectOptionDto.forWishList(wishList))
        .sort((wishListA, wishListB) => wishListA.name.localeCompare(wishListB.name.toString()))
      if (this.initialValue) {
        this.wishListId = this.initialValue;
      } else {
        this.wishListId = this.wishListSelectOptions[0].id;
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  writeValue(selectedOption: WishListSelectOptionDto | String): void {
    if (selectedOption !== undefined) {
      if (selectedOption instanceof WishListSelectOptionDto) {
        this.wishListId = selectedOption.id;
      } else if (selectedOption instanceof String) {
        this.wishListId = String(selectedOption);
      }
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


}
