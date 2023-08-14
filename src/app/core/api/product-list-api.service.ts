import { Injectable } from '@angular/core';
import { WanticError } from '@core/models/error.model';
import { ProductList } from '@core/models/product-list.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListApiService {

  private static REST_END_POINT = 'product-lists';

  constructor(private apiService: ApiService,) { }

  create(productList: ProductList): Observable<ProductList> {
    return this.apiService.post<ProductList>(`${ApiVersion.v1}/${ProductListApiService.REST_END_POINT}`, productList).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }

  getAll(): Observable<Array<ProductList>> {
    return this.apiService.get<Array<ProductList>>(`${ApiVersion.v1}/${ProductListApiService.REST_END_POINT}`).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }

  getById(id: string): Observable<ProductList> {
    return this.apiService.get<ProductList>(`${ApiVersion.v1}/${ProductListApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }

  update(productList: ProductList): Observable<ProductList> {
    return this.apiService.put<ProductList>(`${ApiVersion.v1}/${ProductListApiService.REST_END_POINT}/${productList.id}`, productList).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }

  deleteById(id: string): Observable<void> {
    return this.apiService.delete<void>(`${ApiVersion.v1}/${ProductListApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }
}
