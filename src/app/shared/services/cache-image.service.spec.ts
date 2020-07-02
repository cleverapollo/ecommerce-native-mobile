import { TestBed } from '@angular/core/testing';

import { CacheImageService } from './cache-image.service';

describe('CacheImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CacheImageService = TestBed.get(CacheImageService);
    expect(service).toBeTruthy();
  });
});
