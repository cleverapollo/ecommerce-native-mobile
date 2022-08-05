import { Injectable } from '@angular/core';
import { Logger } from '../log.service';
import { AffiliateDefaultService } from './affiliate-default.service';
import { AffiliateDouglasService } from './affiliate-douglas.service';

@Injectable({
  providedIn: 'root'
})
export class AffiliateLinkService {

  private get affiliateServices(): AffiliateService[] {
    return [
      this.defaultService,
      this.douglasService
    ]
  }

  constructor(
    private defaultService: AffiliateDefaultService,
    private douglasService: AffiliateDouglasService,
    private logger: Logger
  ) {
  }

  createAffiliateLink(productUrlString: string): Promise<string> {
    try {
      const productURL = new URL(productUrlString);
      const domain = productURL.hostname.startsWith('www.') ? productURL.hostname.substring(4) : productURL.hostname;
      for (const affiliateService of this.affiliateServices) {
        if (affiliateService.supportsDomain(domain)) {
          return affiliateService.createAffiliateLink(productUrlString);
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve(productUrlString);
  }

}
