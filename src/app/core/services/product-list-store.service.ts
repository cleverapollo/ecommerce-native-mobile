import { Injectable } from '@angular/core';
import { ContentCreatorApiService } from '@core/api/content-creator-api.service';
import { ProductApiService } from '@core/api/product-api.service';
import { ProductListApiService } from '@core/api/product-list-api.service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { Product, ProductList, ProductListCommand, SharedProductList } from '@core/models/product-list.model';
import { BehaviorSubject, Observable, lastValueFrom, of } from 'rxjs';
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
    private publicResourceApi: PublicResourceApiService,
    private creatorApi: ContentCreatorApiService
  ) { }

  get productLists$(): Observable<ProductList[]> {
    return this._productLists$
  }

  get sharedProductLists$(): Observable<SharedProductList[]> {
    return this._sharedProductLists$
  }

  getById(id: string, forceRefresh: boolean = false): Observable<ProductList> {
    const request = this.productListApi.getById(id).pipe(
      tap(productList => this._updateProductList(productList))
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
      tap(product => this._updateProduct(product))
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
      tap(productList => this._updateSharedProductList(productList))
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

  getProductListsForCreator(userName: string): Promise<ProductList[]> {
    return lastValueFrom(this.creatorApi.getProductLists(userName));
  }

  getProductList(userName: string, listId: string): Promise<SharedProductList> {
    return lastValueFrom(this.creatorApi.getProductList(userName, listId));
  }

  create(productList: ProductListCommand): Observable<ProductList> {
    return this.productListApi.create(productList).pipe(
      tap(createdList => this._addProductList(createdList))
    )
  }

  createProduct(product: Product): Promise<Product> {
    return lastValueFrom(this.productApi.create(product).pipe(
      tap(createdProduct => this._addProduct(createdProduct))
    ));
  }

  update(productList: ProductList): Observable<ProductList> {
    return this.productListApi.update(productList).pipe(
      tap(updatedList => this._updateProductList(updatedList))
    )
  }

  updateProduct(product: Product, productListId: string): Promise<Product> {
    const switchProductList = product.productListId !== productListId;
    return lastValueFrom(this.productApi.update(product).pipe(
      tap(updatedProduct => {
        if (switchProductList) {
          this._deleteProduct(product.id);
        }
        this._updateProduct(updatedProduct);
      })
    ));
  }

  deleteById(id: string): Observable<void> {
    return this.productListApi.deleteById(id).pipe(
      tap(() => this._deleteProductList(id))
    );
  }

  deleteProduct(id: string): Promise<void> {
    return lastValueFrom(this.productApi.delete(id).pipe(
      tap(() => this._deleteProduct(id))
    ));
  }

  private _addProductList(productList: ProductList): void {
    this._productLists.value.push(productList);
    this._productLists.next(this._productLists.value);
  }

  private _updateProductList(productList: ProductList): void {
    this._updateList(this._productLists, productList);
  }

  private _updateSharedProductList(productList: SharedProductList): void {
    this._updateList(this._sharedProductLists, productList);
  }

  private _updateList(lists$: BehaviorSubject<ProductList[] | SharedProductList[]>, listToUpdate: ProductList | SharedProductList): void {
    lists$.next(
      lists$.value.map(list =>
        list.id === listToUpdate.id ? listToUpdate : list
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

  private _addProduct(product: Product): void {
    const add = (products: Product[]): Product[] => {
      products.push(product);
      return products;
    }

    this._productLists.next(
      this._productLists.value.map(list =>
        list.id === product.productListId ?
          {
            ...list,
            products: add(list.products)
          } :
          list
      )
    )
  }

  private _updateProduct(product: Product): void {
    this._productLists.next(
      this._productLists.value.map(list =>
        list.id === product.productListId ?
          {
            ...list,
            products: list.products.map(item =>
              item.id === product.id ? product : item
            )
          } :
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
