import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';

describe('FileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: FileService = TestBed.inject(FileService);
    expect(service).toBeTruthy();
  });
});
