import { Injectable } from '@angular/core';
import { AffiliateProgramme } from '@core/models/affiliate.model';
import { WishDto } from '@core/models/wish-list.model';
import { AffiliateDataStoreService } from '@core/data/affiliate-data-store.service';
import { LogService } from './log.service';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

@Injectable({
  providedIn: 'root'
})
export class AffiliateService {

  constructor(
    private logger: LogService, 
    private affiliateDataStore: AffiliateDataStoreService) 
    { }


  createAffiliateLinkForWish(wish: WishDto | FriendWish) {
    wish.productUrl = this.createAffiliateLink(wish.productUrl);
    return wish;
  }

  createAffiliateLink(productUrlUrlString: string): string {
    let affiliateProgrammes = this.affiliateDataStore.affiliateProgrammes;
    let affiliateLink = productUrlUrlString;
    let affiliateProgramme = null;
    let productUrl: URL = null;
    
    try {
      productUrl = new URL(productUrlUrlString);
      const domain = productUrl.hostname.startsWith('www.') ? productUrl.hostname.substring(4) : productUrl.hostname;
      for (const programme of affiliateProgrammes) {
        if (this.affiliateProgrammeSupportsDomain(programme, domain)) {
          affiliateProgramme = programme;
          break;
        }
      }
    } catch (error) {
      this.logger.error(error);
    }

    if (productUrl && affiliateProgramme) {
      affiliateLink = this.buildAffiliateLinkForProgramme(affiliateProgramme, productUrl);
    }

    return affiliateLink;
  }

  private affiliateProgrammeSupportsDomain(programme: AffiliateProgramme, domain: string): boolean {
    let isIncluded = false
    for (const validDomain of programme.validDomains) {
      if (domain === validDomain || domain.endsWith(validDomain)) {
        isIncluded = true;
        break;
      }
    }
    return isIncluded;
  }

  private buildAffiliateLinkForProgramme(programme: AffiliateProgramme, productUrl: URL): string {
    let affiliateLink = programme.deeplinkTemplate;

    if (affiliateLink.includes('${QUERY_PARAM_SEPERATOR}tag=') && productUrl.searchParams.has('tag')) { 
      productUrl.searchParams.delete('tag');
    }

    affiliateLink = affiliateLink.replace('${ADVERTISER_ID}', programme.advertiserId);
    affiliateLink = affiliateLink.replace('${PRODUCT_URL}', productUrl.toString());
    
    affiliateLink = this.replaceEncodedProductUrl(affiliateLink, productUrl);
    if (affiliateLink === null) {
      return productUrl.toString();
    }
    
    affiliateLink = affiliateLink.replace('${QUERY_PARAM_SEPERATOR}', productUrl.search ? '&' : '?');

    return affiliateLink;
  }

  private replaceEncodedProductUrl(deeplinkTemplate: string, productUrl: URL) {
    try {
      return deeplinkTemplate.replace('${ENCODED_PRODUCT_URL}', encodeURIComponent(productUrl.toString()));
    } catch (error) {
      return null;
    }
  }


}
