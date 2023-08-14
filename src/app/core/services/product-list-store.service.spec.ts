import { TestBed } from '@angular/core/testing';

import { ProductListStoreService } from './product-list-store.service';

describe('ProductListStoreService', () => {
  let service: ProductListStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
