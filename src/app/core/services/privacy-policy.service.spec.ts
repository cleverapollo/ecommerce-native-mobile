import { TestBed } from '@angular/core/testing';

import { PrivacyPolicyService } from './privacy-policy.service';

describe('PrivacyPolicyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: PrivacyPolicyService = TestBed.get(PrivacyPolicyService);
    expect(service).toBeTruthy();
  });
});
