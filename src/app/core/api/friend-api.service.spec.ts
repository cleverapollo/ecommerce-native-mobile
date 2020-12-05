import { TestBed } from '@angular/core/testing';

import { FriendApiService } from './friend-api.service';

describe('FriendApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: FriendApiService = TestBed.get(FriendApiService);
    expect(service).toBeTruthy();
  });
});
