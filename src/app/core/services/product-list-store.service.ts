import { Injectable } from '@angular/core';
import { ProductListApiService } from '@core/api/product-list-api.service';
import { ProductList } from '@core/models/product-list.model';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Logger } from './log.service';

const TTL = 60 * 60;
const GROUP_KEY = 'productList';
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class ProductListStoreService {

  productLists$ = new BehaviorSubject<ProductList[]>([]);

  constructor(
    private productListApi: ProductListApiService,
    private cache: CacheService,
    private logger: Logger
  ) { }

  getById(id: string, forceRefresh: boolean): Observable<ProductList> {
    const request = this.productListApi.getById(id);
    const cacheKey = this.getCacheKey(id);
    return forceRefresh ?
      this.cache.loadFromDelayedObservable(cacheKey, request, GROUP_KEY, TTL, 'all') :
      this.cache.loadFromObservable(cacheKey, request, GROUP_KEY);
  }

  getAll(forceRefresh: boolean): Observable<ProductList[]> {
    const request = this.productListApi.getAll().pipe(
      tap(value => this.productLists$.next(value))
    );
    const cacheKey = 'productListAll';
    return forceRefresh ?
      this.cache.loadFromDelayedObservable(cacheKey, request, GROUP_KEY, TTL, 'all') :
      this.cache.loadFromObservable(cacheKey, request, GROUP_KEY);
  }

  create(productList: ProductList): Observable<ProductList> {
    return this.productListApi.create(productList).pipe(
      tap(createdList => {
        this.productLists$.value.push(createdList);
      })
    )
  }

  update(productList: ProductList): Observable<ProductList> {
    return this.productListApi.update(productList).pipe(
      tap(updatedList => {
        const index = this.productLists$.value.findIndex(list => list.id === updatedList.id);
        if (index > -1) {
          this.productLists$.value[index] = updatedList;
        }
      })
    )
  }

  deleteById(id: string): Observable<void> {
    return this.productListApi.deleteById(id).pipe(
      tap(() => {
        const index = this.productLists$.value.findIndex(list => list.id === id);
        if (index > -1) {
          this.productLists$.value.splice(index, 1);
        }
      }),
      mergeMap(() => this.cache.removeItem(this.getCacheKey(id)))
    );
  }

  private getCacheKey(id: string): string {
    if (!id) {
      this.logger.error('Id is missing to create a unique cache key!');
    }
    return `productList${id}`;
  }

}
