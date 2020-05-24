import { TestBed } from '@angular/core/testing';

import { EmailVerificationResolver } from './email-verification.resolver';

describe('EmailVerificationResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailVerificationResolver = TestBed.get(EmailVerificationResolver);
    expect(service).toBeTruthy();
  });
});
