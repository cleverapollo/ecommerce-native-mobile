import { TestBed } from '@angular/core/testing';

import { CoreToastService } from './toast.service';

describe('ToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: CoreToastService = TestBed.get(CoreToastService);
    expect(service).toBeTruthy();
  });
});
