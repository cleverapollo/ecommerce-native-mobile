import { Injectable } from '@angular/core';
import { AffiliateProgramme } from '@core/models/affiliate.model';
import { WishDto } from '@core/models/wish-list.model';
import { AffiliateDataStoreService } from '@core/data/affiliate-data-store.service';
import { LogService } from '../log.service';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';


@Injectable({
  providedIn: 'root'
})
export class AffiliateDefaultService implements AffiliateService {

  constructor(
    private logger: LogService, 
    private affiliateDataStore: AffiliateDataStoreService) 
    { }
  
  supportsDomain(domain: string): boolean {
    let support = false;
    const affiliateProgrammes = this.affiliateDataStore.affiliateProgrammes;
    for (const programme of affiliateProgrammes) {
      if (this.affiliateProgrammeSupportsDomain(programme, domain)) {
        support = true;
        break;
      }
    }
    return support;
  }

  async createAffiliateLinkForWish(wish: WishDto | FriendWish): Promise<WishDto | FriendWish> {
    const affiliateLink = await this.createAffiliateLink(wish.productUrl);
    wish.productUrl = affiliateLink;
    return wish;
  }

  createAffiliateLink(productUrlString: string): Promise<string> {
    const affiliateProgrammes = this.affiliateDataStore.affiliateProgrammes;
    let affiliateLink = productUrlString;
    let affiliateProgramme = null;
    let productUrl: URL = null;
    
    try {
      productUrl = new URL(productUrlString);
      const domain = productUrl.hostname.startsWith('www.') ? productUrl.hostname.substring(4) : productUrl.hostname;
      for (const programme of affiliateProgrammes) {
        if (this.affiliateProgrammeSupportsDomain(programme, domain)) {
          affiliateProgramme = programme;
          break;
        }
      }
    } catch (error) {
      this.logger.error(error);
      return Promise.resolve(productUrlString);
    }

    if (affiliateProgramme === null) {
      affiliateProgramme = this.sovrnAffiliateProgramme;
    }
    if (affiliateProgramme) {
      affiliateLink = this.buildAffiliateLinkForProgramme(affiliateProgramme, productUrl);
    }

    return Promise.resolve(affiliateLink);
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

  private get sovrnAffiliateProgramme(): AffiliateProgramme {
    const programmes = this.affiliateDataStore.affiliateProgrammes;
    return programmes.find(v => v.validDomains.includes('*'));
  }


}
