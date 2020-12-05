import { TestBed } from '@angular/core/testing';

import { UserProfileStore } from './user-profile-store.service';

describe('UserProfileDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: UserProfileStore = TestBed.get(UserProfileStore);
    expect(service).toBeTruthy();
  });
});
