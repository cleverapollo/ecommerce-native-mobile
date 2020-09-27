import { TestBed } from '@angular/core/testing';

import { RegistrationApiService } from './registration-api.service';

describe('RegistrationApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationApiService = TestBed.get(RegistrationApiService);
    expect(service).toBeTruthy();
  });
});
