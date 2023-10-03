import { Injectable } from '@angular/core';
import { ProductApiService } from '@core/api/product-api.service';
import { ProductListApiService } from '@core/api/product-list-api.service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { Product, ProductList, ProductListCommand, SharedProductList } from '@core/models/product-list.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductListStoreService {

  private _productLists = new BehaviorSubject<ProductList[]>([]);
  private _productLists$ = this._productLists.asObservable();

  private _sharedProductLists = new BehaviorSubject<SharedProductList[]>([]);
  private _sharedProductLists$ = this._sharedProductLists.asObservable();

  constructor(
    private productListApi: ProductListApiService,
    private productApi: ProductApiService,
    private publicResourceApi: PublicResourceApiService
  ) { }

  get productLists$(): Observable<ProductList[]> {
    return this._productLists$
  }

  get sharedProductLists$(): Observable<SharedProductList[]> {
    return this._sharedProductLists$
  }

  getById(id: string, forceRefresh: boolean = false): Observable<ProductList> {
    const request = this.productListApi.getById(id).pipe(
      tap(productList => this._upsertProductList(productList))
    );
    return this.productLists$.pipe(
      concatMap(productLists => {
        if (!productLists.length || forceRefresh) {
          return request;
        }
        const listIdx = productLists.findIndex(productList => productList.id === id);
        if (listIdx === -1) {
          return request;
        }
        return of(productLists[listIdx]);
      })
    )
  }

  getProduct(productId: string, forceRefresh: boolean = false): Observable<Product> {
    const request = this.productApi.get(productId).pipe(
      first(),
      tap(product => this._upsertProduct(product))
    )
    return this.productLists$.pipe(
      concatMap(productLists => {
        if (!productLists.length || forceRefresh) {
          return request;
        }
        const list = productLists.filter(
          lists => lists.products.findIndex(product => product.id === productId) > -1
        )?.[0];

        if (!list) {
          return request;
        }
        const idx = list.products.findIndex(product => product.id === productId);
        return of(list.products[idx]);
      })
    )
  }

  getSharedListByName(userName: string, listName: string, forceRefresh: boolean = false): Observable<SharedProductList> {
    const request = this.publicResourceApi.getProductList(userName, listName).pipe(
      tap(productList => this._upsertSharedProductList(productList))
    )
    return this.sharedProductLists$.pipe(
      concatMap(productLists => {
        if (!productLists.length || forceRefresh) {
          return request;
        }
        const listIdx = productLists.findIndex(productList => productList.name === listName);
        if (listIdx === -1) {
          return request;
        }
        return of(productLists[listIdx]);
      })
    )
  }

  getAll(forceRefresh: boolean = false): Observable<ProductList[]> {
    const request = this.productListApi.getAll().pipe(
      tap(value => this._productLists.next(value))
    );
    return this.productLists$.pipe(
      concatMap(productLists => {
        if (!productLists.length || forceRefresh) {
          return request;
        }
        return of(productLists);
      })
    )
  }

  create(productList: ProductListCommand): Observable<ProductList> {
    return this.productListApi.create(productList).pipe(
      tap(createdList => this._upsertProductList(createdList))
    )
  }

  createProduct(product: Product): Promise<Product> {
    return this.productApi.create(product).pipe(
      tap(createdProduct => this._upsertProduct(createdProduct))
    ).toPromise();
  }

  update(productList: ProductList): Observable<ProductList> {
    return this.productListApi.update(productList).pipe(
      tap(updatedList => this._upsertProductList(updatedList))
    )
  }

  updateProduct(product: Product, productListId: string): Promise<Product> {
    const switchProductList = product.productListId !== productListId;
    return this.productApi.update(product).pipe(
      tap(updatedProduct => {
        if (switchProductList) {
          this._deleteProduct(product.id);
        }
        this._upsertProduct(updatedProduct);
      })
    ).toPromise();
  }

  deleteById(id: string): Observable<void> {
    return this.productListApi.deleteById(id).pipe(
      tap(() => this._deleteProductList(id))
    );
  }

  deleteProduct(id: string): Promise<void> {
    return this.productApi.delete(id).pipe(
      tap(() => this._deleteProduct(id))
    ).toPromise();
  }

  private _upsertProductList(productList: ProductList): void {
    this._upsertList(this._productLists, productList);
  }

  private _upsertSharedProductList(productList: SharedProductList): void {
    this._upsertList(this._sharedProductLists, productList);
  }

  private _upsertList(lists$: BehaviorSubject<ProductList[] | SharedProductList[]>, listToUpsert: ProductList | SharedProductList): void {
    lists$.next(
      lists$.value.map(list =>
        list.id === listToUpsert.id ? listToUpsert : list
      )
    )
  }

  private _deleteProductList(id: string): void {
    this._productLists.next(
      this._productLists.value.filter(list =>
        list.id !== id
      )
    )
  }

  private _upsertProduct(product: Product): void {
    this._productLists.next(
      this._productLists.value.map(list =>
        list.id === product.productListId ?
          { ...list, products: list.products.map(item => item.id === product.id ? product : item) } :
          list
      )
    )
  }

  private _deleteProduct(id: string): void {
    this._productLists.next(
      this._productLists.value.map(list =>
        list.id !== id ? list : { ...list, products: list.products.filter(item => item.id !== id) }
      )
    )
  }

}
