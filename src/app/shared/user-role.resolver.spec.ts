import { TestBed } from '@angular/core/testing';

import { UserRoleResolver } from './user-role.resolver';

describe('UserRoleResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserRoleResolver = TestBed.get(UserRoleResolver);
    expect(service).toBeTruthy();
  });
});
