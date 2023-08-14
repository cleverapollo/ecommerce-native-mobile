import { TestBed } from '@angular/core/testing';

import { ProductListApiService } from './product-list-api.service';

describe('ProductListApiService', () => {
  let service: ProductListApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
