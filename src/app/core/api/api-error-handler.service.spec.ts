import { TestBed } from '@angular/core/testing';

import { ApiErrorHandlerService } from './api-error-handler.service';

describe('ApiErrorHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: ApiErrorHandlerService = TestBed.get(ApiErrorHandlerService);
    expect(service).toBeTruthy();
  });
});
