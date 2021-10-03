import { TestBed } from '@angular/core/testing';
import { ApiErrorHandlerService } from './api-error-handler.service';
import { ApiService } from './api.service';

import { PublicResourceApiService } from './public-resource-api.service';

describe('PublicResourceApiService', () => {

  let apiService: any; 
  let errorHandler: any;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: ApiService, useValue: apiService },
      { provide: ApiErrorHandlerService, useValue: errorHandler }
    ]
  }));

  it('should be created', () => {
    const service: PublicResourceApiService = TestBed.get(PublicResourceApiService);
    expect(service).toBeTruthy();
  });
});
