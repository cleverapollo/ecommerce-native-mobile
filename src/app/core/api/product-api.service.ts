import { Injectable } from '@angular/core';
import { WanticError } from '@core/models/error.model';
import { Product } from '@core/models/product-list.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  private static REST_END_POINT = 'products';

  constructor(private apiService: ApiService) { }

  get(id: string): Observable<Product> {
    return this.apiService.get<Product>(`${ApiVersion.v1}/${ProductApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }

  create(product: Product): Observable<Product> {
    return this.apiService.post<Product>(`${ApiVersion.v1}/${ProductApiService.REST_END_POINT}`, product).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }

  update(product: Product): Observable<Product> {
    return this.apiService.put<Product>(`${ApiVersion.v1}/${ProductApiService.REST_END_POINT}/${product.id}`, product).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${ApiVersion.v1}/${ProductApiService.REST_END_POINT}/${id}`).pipe(
      catchError(error => { throw new WanticError(error) })
    );
  }

}
