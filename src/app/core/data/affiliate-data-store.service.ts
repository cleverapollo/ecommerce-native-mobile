import { Injectable } from '@angular/core';
import { AffiliateApiService } from '@core/api/affiliate-api.service';
import { AffiliateProgramme } from '@core/models/affiliate.model';
import { LogService } from '@core/services/log.service';
import { CacheService } from 'ionic-cache';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AffiliateDataStoreService {

  private readonly CACHE_DEFAULT_TTL = 60 * 60 * 24 * 7; // 7d
  private readonly CACHE_GROUP_KEY = 'affiliateMarketing';

  affiliateProgrammes$: Observable<AffiliateProgramme[]>;
  private _affiliateProgrammes$: BehaviorSubject<AffiliateProgramme[]>;

  constructor(private api: AffiliateApiService, private cache: CacheService, private logger: LogService) { 
    this._affiliateProgrammes$ = new BehaviorSubject([]);
    this.affiliateProgrammes$ = this._affiliateProgrammes$.asObservable();
  }

  get affiliateProgrammes(): AffiliateProgramme[] {
    return this._affiliateProgrammes$.getValue();
  }

  setAffiliateProgrammes(affiliateProgrammes: AffiliateProgramme[]): void {
    this._affiliateProgrammes$.next(affiliateProgrammes);
  }

  async loadData() {
    const request = this.api.getAffiliateMarketingProgrammes();
    const cacheKey = 'affiliateMarketingProgrammes';
    const cachedData = await this.cache.loadFromObservable<AffiliateProgramme[]>(cacheKey, request, this.CACHE_GROUP_KEY, this.CACHE_DEFAULT_TTL).toPromise();
    this.logger.debug('loaded affiliate programmes ', cachedData);
    this.setAffiliateProgrammes(cachedData);
  }

}
