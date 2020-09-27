import { TestBed, async, inject } from '@angular/core/testing';

import { EmailVerificationTokenGuard } from './email-verification-token.guard';

describe('EmailVerificationTokenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailVerificationTokenGuard]
    });
  });

  it('should ...', inject([EmailVerificationTokenGuard], (guard: EmailVerificationTokenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
