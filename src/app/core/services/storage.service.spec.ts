import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: StorageService = TestBed.inject(StorageService);
    expect(service).toBeTruthy();
  });
});
