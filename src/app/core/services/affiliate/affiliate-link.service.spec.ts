import { TestBed } from '@angular/core/testing';
import { LogService, StubLogService } from '../log.service';
import { AffiliateDefaultService } from './affiliate-default.service';
import { AffiliateDouglasService } from './affiliate-douglas.service';

import { AffiliateLinkService } from './affiliate-link.service';

describe('AffiliateLinkService', () => {
  let service: AffiliateLinkService;
  let douglasAffiliateMockService: AffiliateService = {
    supportsDomain: function (domain: string): boolean {
      return domain === 'douglas.de';
    },
    createAffiliateLink: function (productUrlString: string): Promise<string> {
      return Promise.resolve('https://www.affiliate-link/douglas')
    },
  };
  let defaultAffiliateMockService: AffiliateService = {
    supportsDomain: function (domain: string): boolean {
      return domain === 'amazon.de';
    },
    createAffiliateLink: function (productUrlString: string): Promise<string> {
      return Promise.resolve('https://www.affiliate-link/amazon')
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AffiliateDouglasService, useValue: douglasAffiliateMockService },
        { provide: AffiliateDefaultService, useValue: defaultAffiliateMockService },
        { provide: LogService, useClass: StubLogService }
      ]
    });
    service = TestBed.inject(AffiliateLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a affiliate link', (done) => {
    service.createAffiliateLink('https://www.douglas.de/some-product-url').then( result => {
      expect(result).toEqual('https://www.affiliate-link/douglas');
      done();
    });

    service.createAffiliateLink('https://www.amazon.de/some-product-url').then( result => {
      expect(result).toEqual('https://www.affiliate-link/amazon');
      done();
    });
  });

  it('should return product url', (done) => {
    service.createAffiliateLink('https://some-unsupported-url.de/product').then( result => {
      expect(result).toEqual('https://some-unsupported-url.de/product');
      done();
    });
  });

});
