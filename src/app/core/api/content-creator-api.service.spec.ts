import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

import { ContentCreatorApiService } from './content-creator-api.service';

describe('ContentCreatorApiService', () => {
  let service: ContentCreatorApiService;

  const apiService = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiService }
      ]
    });
    service = TestBed.inject(ContentCreatorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
