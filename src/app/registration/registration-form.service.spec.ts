import { TestBed } from '@angular/core/testing';

import { RegistrationFormService } from './registration-form.service';

describe('RegistrationFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationFormService = TestBed.get(RegistrationFormService);
    expect(service).toBeTruthy();
  });
});
