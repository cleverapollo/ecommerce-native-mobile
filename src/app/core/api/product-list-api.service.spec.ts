import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { ProductListApiService } from './product-list-api.service';

describe('ProductListApiService', () => {
  let service: ProductListApiService;

  const apiService = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiService }
      ]
    });
    service = TestBed.inject(ProductListApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
