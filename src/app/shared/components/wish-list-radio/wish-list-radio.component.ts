import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormBuilder, Validators } from '@angular/forms';
import { WishListSelectOptionDto } from '@core/models/wish-list.model';
import { Logger } from '@core/services/log.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { sortWishListsByName } from '@core/wish-list.utils';
import { iife } from '@shared/helpers/common.helper';
import { lastValueFrom, Observable, of } from 'rxjs';
import { finalize, first, map, tap } from 'rxjs/operators';

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
export class WishListRadioComponent implements OnInit, ControlValueAccessor {

  @Input() _wishListId: string | null = null;
  @Input() initialValue: string | null = null;

  form = this.formBuilder.group({
    name: ['', [Validators.required]]
  });
  isEditMode = false;
  wishListSelectOptions$: Observable<WishListSelectOptionDto[]> = of([]);

  get showSaveWishListButton(): boolean {
    return this.isEditMode && !this.requestIsRunning;
  }

  get showLoading(): boolean {
    return this.isEditMode && this.requestIsRunning;
  }

  get showForm(): boolean {
    return this.form && this.isEditMode;
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

  get wishListId(): string | null {
    return this._wishListId;
  }

  set wishListId(wishListId: string | null) {
    this._wishListId = wishListId;
    this.propagateChange(this._wishListId);
  }

  private _requestIsRunning = false;

  constructor(
    private readonly wishListStore: WishListStoreService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly logger: Logger
  ) {
  }

  ngOnInit() {
    if (this.initialValue) {
      this.wishListId = this.initialValue;
    }
    iife(this.setupData());
  }

  private async setupData(): Promise<void> {
    await lastValueFrom(this.wishListStore.loadWishLists());
    this.wishListSelectOptions$ = this.wishListStore.wishLists.pipe(
      map(wishLists => {
        return wishLists
          .map(wishList => WishListSelectOptionDto.forWishList(wishList))
          .sort(sortWishListsByName);
      }),
      tap(wishLists => {
        if (this.wishListId === null) {
          this.wishListId = wishLists[0]?.id ?? null;
        }
      })
    );
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
    this.requestIsRunning = true;
    this.wishListStore.createWishList({
      name: nameControl.value,
      showReservedWishes: false
    }).pipe(
      first(),
      finalize(() => {
        this.requestIsRunning = false;
      })
    ).subscribe({
      next: newWishList => {
        this.wishListId = newWishList.id;
        this.isEditMode = false;
        nameControl.reset();
      },
      error: error => {
        this.logger.error(error)
      }
    })
  }

  enableEditMode() {
    this.isEditMode = true;
  }

  propagateChange = (_: any) => { };
  onTouched: any = (_: any) => { };

}
