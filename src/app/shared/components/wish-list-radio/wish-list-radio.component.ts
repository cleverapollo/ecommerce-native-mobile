import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListDto, WishListSelectOptionDto } from '@core/models/wish-list.model';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { WishListCreateRequest } from '@wishLists/wish-list-create-update/wish-list-create-update.model';
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
  _wishListId: Number;

  @Input()
  initialValue: Number;

  get wishListId(): Number {
    return this._wishListId;
  }

  set wishListId(wishListId: Number) {
    this._wishListId = wishListId;
    this.propagateChange(this._wishListId);
  }

  wishListSelectOptions: Array<WishListSelectOptionDto> = [];
  newWishListName: string = '';
  showAddNewWishListInput: boolean = false;
  subscription: Subscription;

  propagateChange = (_: any) => {};
  onTouched: any = (_: any) => { };

  constructor(
    private wishListApiService: WishListApiService,
    private wishListStore: WishListStoreService
  ) { }

  ngOnInit() {
    this.initWishListSelectOptions();
  }

  private initWishListSelectOptions() {
    this.subscription = this.wishListStore.loadWishLists().subscribe(wishLists => {
      this.wishListSelectOptions = wishLists.map(wishList => WishListSelectOptionDto.forWishList(wishList))
      if (this.initialValue) {
        this.wishListId = this.initialValue;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(selectedOption: WishListSelectOptionDto | Number): void {
    if (selectedOption !== undefined) {
      if (selectedOption instanceof WishListSelectOptionDto) {
        this.wishListId = selectedOption.id;
      } else if (selectedOption instanceof Number) {
        this.wishListId = selectedOption;
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

  toggleShowAddNewWishListInput() {
    this.showAddNewWishListInput = !this.showAddNewWishListInput;
  }

  createNewWishList() {
    const requestData = new WishListCreateRequest(this.newWishListName);
    this.wishListApiService.create(requestData).subscribe(createdWishList => {
      this.wishListStore.saveWishListToCache(createdWishList);
      this.handleNewCreatedWishList(createdWishList);
      this.resetNewWishListForm();
    });
  }

  private handleNewCreatedWishList(createdWishList: WishListDto) {
    const newWishListSelectOption = WishListSelectOptionDto.forWishList(createdWishList);
    this.wishListSelectOptions.push(newWishListSelectOption);
    this.writeValue(newWishListSelectOption);
  }

  private resetNewWishListForm() {
    this.newWishListName = '';
    this.showAddNewWishListInput = false;
  }
}
