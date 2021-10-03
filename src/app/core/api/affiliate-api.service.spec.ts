import { TestBed } from '@angular/core/testing';
import { AffiliateProgramme } from '@core/models/affiliate.model';
import { from, Observable } from 'rxjs';

import { AffiliateApiService } from './affiliate-api.service';
import { ApiService } from './api.service';

describe('AffiliateApiService', () => {

  let apiServiceMock = {
    get() : Observable<AffiliateProgramme[]> {
      return from([])
    }
  }
  let service: AffiliateApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });
    service = TestBed.inject(AffiliateApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
