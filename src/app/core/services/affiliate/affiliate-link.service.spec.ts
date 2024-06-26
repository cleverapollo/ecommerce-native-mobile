import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { Logger } from '../log.service';
import { LoggerFake } from '../log.service.mock';
import { AffiliateDefaultService } from './affiliate-default.service';
import { AffiliateDouglasService } from './affiliate-douglas.service';

import { AffiliateLinkService } from './affiliate-link.service';

describe('AffiliateLinkService', () => {
  let service: AffiliateLinkService;
  const douglasAffiliateMockService: AffiliateService = {
    supportsDomain: (domain: string): boolean => {
      return domain === 'douglas.de';
    },
    createAffiliateLink(productUrlString: string): Promise<string>{
      return Promise.resolve('https://www.affiliate-link/douglas')
    },
  };
  const defaultAffiliateMockService: AffiliateService = {
    supportsDomain(domain: string): boolean {
      return domain === 'amazon.de';
    },
    createAffiliateLink(productUrlString: string): Promise<string> {
      return Promise.resolve('https://www.affiliate-link/amazon')
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        { provide: AffiliateDouglasService, useValue: douglasAffiliateMockService },
        { provide: AffiliateDefaultService, useValue: defaultAffiliateMockService },
        { provide: Logger, useClass: LoggerFake }
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
