import { Injectable } from '@angular/core';
import { AffiliateProgramme } from '@core/models/affiliate.model';
import { Observable } from 'rxjs';
import { ApiVersion } from './api-version';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AffiliateApiService {

  private static REST_END_POINT = 'affiliate';

  constructor(private apiService: ApiService) { }

  getAffiliateMarketingProgrammes(): Observable<AffiliateProgramme[]> {
    return this.apiService.get<AffiliateProgramme[]>(`${ApiVersion.v1}/${AffiliateApiService.REST_END_POINT}/programmes`);
  }

}
