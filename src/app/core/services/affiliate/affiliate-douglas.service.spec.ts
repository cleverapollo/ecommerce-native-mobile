import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { AffiliateDouglasService } from './affiliate-douglas.service';
import { HttpClient } from '@angular/common/http';
import { Logger } from '@core/services/log.service';

import bodyMilkGeneratorResult from './affiliate-douglas-bodymilk-response';
import parfumeGeneratorResult from './affiliate-douglas-parfum-response';
import { DefaultPlatformService, PlatformMockService } from '../platform.service';
import { LoggerFake } from '../log.service.mock';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('AffiliateDouglasService', () => {
  let service: AffiliateDouglasService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const platformService: PlatformMockService = new PlatformMockService();

  beforeEach(() => {
    platformService.setupIOS(); // simulate any native platform

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, LoggerTestingModule ],
      providers: [ {
        provide: Logger, useClass: LoggerFake,
      }, {
        provide: DefaultPlatformService, useValue: platformService
      }]
    });
    service = TestBed.inject(AffiliateDouglasService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return affiliate link for body milk', (done) => {
    const bodyMilkProductLink = 'https://www.douglas.de/de/p/3000000215?variant=708800';

    service.createAffiliateLink(bodyMilkProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual('https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=https%3A%2F%2Fa.nonstoppartner.net%2Fa%2F%3Fi%3Dclick%26client%3Ddouglas%26camp%3Dwmgdeep%26nw%3Dfiw1%26l%3Dde%26uri%3DaHR0cHM6Ly93d3cuZG91Z2xhcy5kZS9kZS9wLzMwMDAwMDAyMTU_dmFyaWFudD03MDg4MDA');
      done();
    })

    const testRequest = httpMock.expectOne('http://adgenerator.nonstoppartner.net/?clientURL=https%3A%2F%2Fwww.douglas.de%2Fde%2Fp%2F3000000215%3Fvariant%3D708800&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https%3A%2F%2Fwww.awin1.com%2Fawclick.php%3Fgid%3D362940%26mid%3D10076%26awinaffid%3D813821%26linkid%3D2383202%26clickref%3D%26clickref2%3D%26p%3D&nw=fiw1');
    expect(testRequest.request.method).toEqual('GET');
    expect(testRequest.request.responseType).toEqual('text');
    testRequest.flush({ data: bodyMilkGeneratorResult });

    httpMock.verify();
  });

  it('should return affiliate link for parfume', (done) => {
    const parfumeProductLink = 'https://www.douglas.de/de/p/1001407304';

    service.createAffiliateLink(parfumeProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual('https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=https%3A%2F%2Fa.nonstoppartner.net%2Fa%2F%3Fi%3Dclick%26client%3Ddouglas%26camp%3Dwmgdeep%26nw%3Dfiw1%26l%3Dde%26uri%3DaHR0cHM6Ly93d3cuZG91Z2xhcy5kZS9kZS9wLzEwMDE0MDczMDQ');
      done();
    })

    const testRequest = httpMock.expectOne('http://adgenerator.nonstoppartner.net/?clientURL=https%3A%2F%2Fwww.douglas.de%2Fde%2Fp%2F1001407304&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https%3A%2F%2Fwww.awin1.com%2Fawclick.php%3Fgid%3D362940%26mid%3D10076%26awinaffid%3D813821%26linkid%3D2383202%26clickref%3D%26clickref2%3D%26p%3D&nw=fiw1');
    expect(testRequest.request.method).toEqual('GET');
    expect(testRequest.request.responseType).toEqual('text');
    testRequest.flush({ data: parfumeGeneratorResult });

    httpMock.verify();
  });

  it('should return product link for non Douglas products', (done) => {
    const otherProductLink = 'https://www.some-other-product-link';
    service.createAffiliateLink(otherProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual(otherProductLink);
      done();
    })
  });

  it('should return product link for failing generator request', (done) => {
    const parfumeProductLink = 'https://www.douglas.de/de/p/1001407304';
    service.createAffiliateLink(parfumeProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual(parfumeProductLink);
      done();
    });

    const testRequest = httpMock.expectOne('http://adgenerator.nonstoppartner.net/?clientURL=https%3A%2F%2Fwww.douglas.de%2Fde%2Fp%2F1001407304&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https%3A%2F%2Fwww.awin1.com%2Fawclick.php%3Fgid%3D362940%26mid%3D10076%26awinaffid%3D813821%26linkid%3D2383202%26clickref%3D%26clickref2%3D%26p%3D&nw=fiw1');
    expect(testRequest.request.method).toEqual('GET');
    expect(testRequest.request.responseType).toEqual('text');
    testRequest.flush('Invalid query parameters', { status: 400, statusText: 'Bad Request' });

    httpMock.verify();
  });

  it('should return product link if result doesnt contain a affilliate link', (done) => {
    const parfumeProductLink = 'https://www.douglas.de/de/p/1001407304';
    service.createAffiliateLink(parfumeProductLink).then( affiliateLink => {
      expect(affiliateLink).toEqual(parfumeProductLink);
      done();
    });

    const testRequest = httpMock.expectOne('http://adgenerator.nonstoppartner.net/?clientURL=https%3A%2F%2Fwww.douglas.de%2Fde%2Fp%2F1001407304&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https%3A%2F%2Fwww.awin1.com%2Fawclick.php%3Fgid%3D362940%26mid%3D10076%26awinaffid%3D813821%26linkid%3D2383202%26clickref%3D%26clickref2%3D%26p%3D&nw=fiw1');
    expect(testRequest.request.method).toEqual('GET');
    expect(testRequest.request.responseType).toEqual('text');
    testRequest.flush({ data: '<html><body></body></html>' });

    httpMock.verify();
  });

  it('should support just douglas domain', () => {
    expect(service.supportsDomain('douglas.de')).toBeTruthy();
    expect(service.supportsDomain('www.douglas.de')).toBeFalsy();
    expect(service.supportsDomain('baur.de')).toBeFalsy();
    expect(service.supportsDomain('amazon.de')).toBeFalsy();
  });

  it('should support just native apps due to cors restrictions in web-app', () => {
    platformService.setupIOS();
    expect(service.supportsDomain('douglas.de')).toBeTruthy();
    platformService.setupAndroid();
    expect(service.supportsDomain('douglas.de')).toBeTruthy();
    platformService.setupWeb();
    expect(service.supportsDomain('douglas.de')).toBeFalsy();
  })

});
