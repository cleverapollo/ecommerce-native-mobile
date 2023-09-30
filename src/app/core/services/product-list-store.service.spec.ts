import { TestBed } from '@angular/core/testing';

import { ProductListApiService } from '@core/api/product-list-api.service';
import { PublicResourceApiService } from '@core/api/public-resource-api.service';
import { CacheService } from 'ionic-cache';
import { Logger } from './log.service';
import { ProductListStoreService } from './product-list-store.service';

describe('ProductListStoreService', () => {

  let productListApi: ProductListApiService
  let publicResourceApi: PublicResourceApiService
  let cache: CacheService
  let logger: Logger

  let service: ProductListStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductListApiService, useValue: productListApi },
        { provide: PublicResourceApiService, useValue: publicResourceApi },
        { provide: CacheService, useValue: cache },
        { provide: Logger, useValue: logger }
      ]
    });
    service = TestBed.inject(ProductListStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
