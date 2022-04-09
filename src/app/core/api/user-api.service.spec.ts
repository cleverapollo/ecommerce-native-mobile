import { TestBed } from '@angular/core/testing';

import { UserApiService } from './user-api.service';

describe('UserApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: UserApiService = TestBed.inject(UserApiService);
    expect(service).toBeTruthy();
  });
});
