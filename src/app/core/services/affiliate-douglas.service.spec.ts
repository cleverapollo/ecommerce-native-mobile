import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { AffiliateDouglasService } from './affiliate-douglas.service';
import { HttpClient } from '@angular/common/http';
import { LogService } from './log.service';

import bodyMilkGeneratorResult from './affiliate-douglas-bodymilk-response';
import parfumeGeneratorResult from './affiliate-douglas-parfum-response';

describe('AffiliateDouglasService', () => {
  let service: AffiliateDouglasService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let loggerMock: any = {
    error(msg: string) { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ {
        provide: LogService, useValue: loggerMock
      }]
    });
    service = TestBed.inject(AffiliateDouglasService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return affiliate link for body milk', () => {
    const bodyMilkProductLink = 'https://www.douglas.de/de/p/3000000215?variant=708800';

    service.createAffiliateLink(bodyMilkProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual('https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=https%3A%2F%2Fa.nonstoppartner.net%2Fa%2F%3Fi%3Dclick%26client%3Ddouglas%26camp%3Dwmgdeep%26nw%3Dfiw1%26l%3Dde%26uri%3DaHR0cHM6Ly93d3cuZG91Z2xhcy5kZS9kZS9wLzMwMDAwMDAyMTU_dmFyaWFudD03MDg4MDA');
    })

    const testRequest = httpMock.expectOne('http://adgenerator.nonstoppartner.net/?clientURL=https://www.douglas.de/de/p/3000000215?variant=708800&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=&nw=fiw1');
    expect(testRequest.request.method).toEqual('GET');
    expect(testRequest.request.responseType).toEqual('text');
    testRequest.flush({ data: bodyMilkGeneratorResult });

    httpMock.verify();
  });

  it('should return affiliate link for parfume', () => {
    const parfumeProductLink = 'https://www.douglas.de/de/p/1001407304';

    service.createAffiliateLink(parfumeProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual('https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=https%3A%2F%2Fa.nonstoppartner.net%2Fa%2F%3Fi%3Dclick%26client%3Ddouglas%26camp%3Dwmgdeep%26nw%3Dfiw1%26l%3Dde%26uri%3DaHR0cHM6Ly93d3cuZG91Z2xhcy5kZS9kZS9wLzEwMDE0MDczMDQ');
    })

    const testRequest = httpMock.expectOne('http://adgenerator.nonstoppartner.net/?clientURL=https://www.douglas.de/de/p/1001407304&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=&nw=fiw1');
    expect(testRequest.request.method).toEqual('GET');
    expect(testRequest.request.responseType).toEqual('text');
    testRequest.flush({ data: parfumeGeneratorResult });

    httpMock.verify();
  });

  it('should return product link for non Douglas products', () => {
    const otherProductLink = 'https://www.some-other-product-link';
    service.createAffiliateLink(otherProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual(otherProductLink);
    })
  });

  it('should return product link for failing generator request', () => {
    const parfumeProductLink = 'https://www.douglas.de/de/p/1001407304';
    service.createAffiliateLink(parfumeProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual(parfumeProductLink);
    });

    const testRequest = httpMock.expectOne('http://adgenerator.nonstoppartner.net/?clientURL=https://www.douglas.de/de/p/1001407304&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=&nw=fiw1');
    expect(testRequest.request.method).toEqual('GET');
    expect(testRequest.request.responseType).toEqual('text');
    testRequest.flush('Invalid query parameters', { status: 400, statusText: 'Bad Request' });

    httpMock.verify();
  });

  it('should return product link if result doesnt contain a affilliate link', () => {
    const parfumeProductLink = 'https://www.douglas.de/de/p/1001407304';
    service.createAffiliateLink(parfumeProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual(parfumeProductLink);
    });

    const testRequest = httpMock.expectOne('http://adgenerator.nonstoppartner.net/?clientURL=https://www.douglas.de/de/p/1001407304&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=&nw=fiw1');
    expect(testRequest.request.method).toEqual('GET');
    expect(testRequest.request.responseType).toEqual('text');
    testRequest.flush({ data: '<html><body></body></html>' });

    httpMock.verify();
  });

});
