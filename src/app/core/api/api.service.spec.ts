import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: ApiService = TestBed.inject(ApiService);
    expect(service).toBeTruthy();
  });
});
