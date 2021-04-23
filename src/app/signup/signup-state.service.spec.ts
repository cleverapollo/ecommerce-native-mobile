import { TestBed } from '@angular/core/testing';

import { SignupStateService } from './signup-state.service';

describe('SignupStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignupStateService = TestBed.get(SignupStateService);
    expect(service).toBeTruthy();
  });
});
