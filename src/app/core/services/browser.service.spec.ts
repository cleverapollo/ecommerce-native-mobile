import { TestBed } from '@angular/core/testing';

import { BrowserService } from './browser.service';

describe('BrowserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: BrowserService = TestBed.inject(BrowserService);
    expect(service).toBeTruthy();
  });
});
