import { TestBed } from '@angular/core/testing';

import { PublicResourceApiService } from './public-resource-api.service';

describe('PublicResourceApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublicResourceApiService = TestBed.get(PublicResourceApiService);
    expect(service).toBeTruthy();
  });
});
