import { TestBed } from '@angular/core/testing';

import { DefaultPlatformService } from './platform.service';

describe('PlatformService', () => {
  let service: DefaultPlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultPlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
