import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ProductList } from '@core/models/product-list.model';
import { Logger } from '@core/services/log.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { Subscription } from 'rxjs';
import { finalize, first, map } from 'rxjs/operators';

type List = {
  id: string;
  name: string;
}

const sortListByName = (listA: List, wishListB: List) => listA.name.localeCompare(wishListB.name.toString());

const mapLists = (productLists: ProductList[]): List[] => productLists
  .map(productList => {
    return {
      id: productList.id,
      name: productList.name
    };
  })
  .sort(sortListByName);

@Component({
  selector: 'app-product-list-radio',
  templateUrl: './product-list-radio.component.html',
  styleUrls: ['./product-list-radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductListRadioComponent),
      multi: true
    }
  ]
})
export class ProductListRadioComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() initialValue: string | null = null;

  form = new FormGroup({});
  isEditMode = false;
  productLists: List[] = [];

  get showSaveProductListButton(): boolean {
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

  get productListId(): string | null {
    return this._productListId;
  }

  set productListId(productListId: string | null) {
    this._productListId = productListId;
    this.propagateChange(this._productListId);
  }

  private _requestIsRunning = false;
  private _productListId: string | null = null;
  private _subscriptions = new Subscription();

  constructor(
    private productListStore: ProductListStoreService,
    private formBuilder: FormBuilder,
    private logger: Logger
  ) {
  }

  ngOnInit() {
    this.setupForm();
    this.setupProductListId();
    this.setupData();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private setupForm() {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', {
        validators: [Validators.required]
      })
    })
  }

  private setupProductListId() {
    if (this.initialValue) {
      this.productListId = this.initialValue;
    }
  }

  private setupData() {
    [
      this.productListStore.getAll(false).pipe(first()),
      this.productListStore.productLists$
    ].forEach(observable => {
      this._subscriptions.add(observable
        .pipe(map(productLists => mapLists(productLists)))
        .subscribe(productLists => this._updateData(productLists))
      );
    });
  }

  private _updateData(productLists: List[]): void {
    this.productLists = productLists;
    if (this.productListId === null) {
      this.productListId = productLists[0]?.id ?? null;
    }
  }

  writeValue(selectedOption: ProductList | string): void {
    if (!selectedOption) {
      return;
    }

    if (typeof selectedOption === 'string') {
      this.productListId = selectedOption;
    } else {
      this.productListId = selectedOption.id;
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

  createNewProductList() {
    const nameControl = this.form.controls.name;
    if (nameControl.invalid) {
      return;
    }
    this.requestIsRunning = true;
    this.productListStore.create({ name: nameControl.value }).pipe(
      first(),
      finalize(() => {
        this.requestIsRunning = false;
      })
    ).subscribe({
      next: newProductList => {
        this.productListId = newProductList.id;
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
