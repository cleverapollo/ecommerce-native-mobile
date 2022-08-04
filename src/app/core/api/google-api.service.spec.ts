import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { GoogleApiService } from './google-api.service';

describe('GoogleApiService', () => {

  const httpClient: any = {};
  let service: GoogleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient }
      ]
    });
    service = TestBed.inject(GoogleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
