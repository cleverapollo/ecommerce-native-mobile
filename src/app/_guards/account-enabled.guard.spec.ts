import { TestBed, async, inject } from '@angular/core/testing';

import { AccountEnabledGuard } from './account-enabled.guard';

describe('RoleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountEnabledGuard]
    });
  });

  xit('should ...', inject([AccountEnabledGuard], (guard: AccountEnabledGuard) => {
    expect(guard).toBeTruthy();
  }));
});
