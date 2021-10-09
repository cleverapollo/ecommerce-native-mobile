import { TestBed } from '@angular/core/testing';
import { AffiliateProgramme } from '@core/models/affiliate.model';
import { AffiliateDataStoreService } from '../../data/affiliate-data-store.service';

import { AffiliateDefaultService } from './affiliate-default.service';
import { LogService, StubLogService } from '@core/services/log.service';

class MockAffiliateDataStoreService {
  get affiliateProgrammes(): AffiliateProgramme[] {
    
    const awinDeeplinkTemplate = 'https://www.awin1.com/cread.php?awinaffid=813821&awinmid=${ADVERTISER_ID}&ued=${ENCODED_PRODUCT_URL}';
    const adcellDeeplinkTemplate = 'https://t.adcell.com/p/click?promoId=${ADVERTISER_ID}&slotId=92263&param0=${ENCODED_PRODUCT_URL}';

    return [
      { advertiserId: '9074', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['nordicnest.de'] },
      { advertiserId: '11730', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['vertbaudet.de', 'vb-deutschland.de'] },
      { advertiserId: '12181', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['pinkmilk.de'] },
      { advertiserId: '13931', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['littlehipstar.com'] },
      { advertiserId: '14336', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['otto.de'] },
      { advertiserId: '14474', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['hessnatur.com'] },
      { advertiserId: '14824', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['babymarkt.de'] },
      { advertiserId: '15084', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['waschbaer.de', 'waschbaer.at'] },
      { advertiserId: '20180', deeplinkTemplate: awinDeeplinkTemplate, validDomains: ['pearlco.de'] },
      { advertiserId: '6724', deeplinkTemplate: adcellDeeplinkTemplate, validDomains: ['aromamanufaktur.com'] },
      { advertiserId: '6619', deeplinkTemplate: adcellDeeplinkTemplate, validDomains: ['hempamed.de'] },
      { advertiserId: '4760', deeplinkTemplate: adcellDeeplinkTemplate, validDomains: ['klaraseats.com'] },
      { advertiserId: '0', deeplinkTemplate: '${PRODUCT_URL}${QUERY_PARAM_SEPERATOR}tag=helloworldtri-21', validDomains: ['amazon.de','amazon.com'] },
    ]
  }
}

describe('AffiliateDefaultService', () => {
  let service: AffiliateDefaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: LogService,
        useClass: StubLogService
      }, {
        provide: AffiliateDataStoreService,
        useClass: MockAffiliateDataStoreService
      }]
    });
    service = TestBed.inject(AffiliateDefaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create affiliate links correctly', (done) => {
    const unknownProductUrl = "https://www.some-unknown-url.com";
    service.createAffiliateLink(unknownProductUrl).then(result => {
      expect(result).toBe(unknownProductUrl);
      done();
    });

    // AWIN

    service.createAffiliateLink("https://www.otto.de/p/taschenfederkernmatratze-senioren-55-plus-delavita-24-cm-hoch-420-federn-mit-sitzkantenverstaerkung-getestete-qualitaet-mit-4-5-sterne-bewertung-448251235/#variationId=448251326").then(result => {
      expect(result).toBe("https://www.awin1.com/cread.php?awinaffid=813821&awinmid=14336&ued=https%3A%2F%2Fwww.otto.de%2Fp%2Ftaschenfederkernmatratze-senioren-55-plus-delavita-24-cm-hoch-420-federn-mit-sitzkantenverstaerkung-getestete-qualitaet-mit-4-5-sterne-bewertung-448251235%2F%23variationId%3D448251326");
      done();
    });

    service.createAffiliateLink("https://www.pearlco.de/wasserfilter-astra-unimax_9").then(result => {
      expect(result).toBe("https://www.awin1.com/cread.php?awinaffid=813821&awinmid=20180&ued=https%3A%2F%2Fwww.pearlco.de%2Fwasserfilter-astra-unimax_9");
      done();
    });

    service.createAffiliateLink("https://www.nordicnest.de/marken/kay-bojesen-denmark/kay-bojesen-affe-klein/?variantId=6322-01").then(result => {
      expect(result).toBe("https://www.awin1.com/cread.php?awinaffid=813821&awinmid=9074&ued=https%3A%2F%2Fwww.nordicnest.de%2Fmarken%2Fkay-bojesen-denmark%2Fkay-bojesen-affe-klein%2F%3FvariantId%3D6322-01");
      done();
    });

    service.createAffiliateLink("https://www.vertbaudet.de/jungen-langarmshirt-mit-grafischem-motiv-blau-wei.htm?ProductId=700260955&FiltreCouleur=6400&t=1").then(result => {
      expect(result).toBe("https://www.awin1.com/cread.php?awinaffid=813821&awinmid=11730&ued=https%3A%2F%2Fwww.vertbaudet.de%2Fjungen-langarmshirt-mit-grafischem-motiv-blau-wei.htm%3FProductId%3D700260955%26FiltreCouleur%3D6400%26t%3D1");
      done();
    });

    // ADCELL

    service.createAffiliateLink("https://aromamanufaktur.com/collections/geschenkideen/products/winter-set-5x10ml-duft-geschenkset-atherische-winter-ole-im-set").then(result => {
      expect(result).toBe("https://t.adcell.com/p/click?promoId=6724&slotId=92263&param0=https%3A%2F%2Faromamanufaktur.com%2Fcollections%2Fgeschenkideen%2Fproducts%2Fwinter-set-5x10ml-duft-geschenkset-atherische-winter-ole-im-set");
      done();
    });

    service.createAffiliateLink("https://hempamed.de/collections/cbd-mundspray/products/hempamed-cbd-mundspray-natur-5").then(result => {
      expect(result).toBe("https://t.adcell.com/p/click?promoId=6619&slotId=92263&param0=https%3A%2F%2Fhempamed.de%2Fcollections%2Fcbd-mundspray%2Fproducts%2Fhempamed-cbd-mundspray-natur-5");
      done();
    });

    service.createAffiliateLink("https://www.klaraseats.com/KAB-554-24V-Stoff-Havanna-schwarz-Heizung-Armlehnen-Kopfstuetze").then(result => {
      expect(result).toBe("https://t.adcell.com/p/click?promoId=4760&slotId=92263&param0=https%3A%2F%2Fwww.klaraseats.com%2FKAB-554-24V-Stoff-Havanna-schwarz-Heizung-Armlehnen-Kopfstuetze");
      done();
    });

    // Amazon

    service.createAffiliateLink("https://www.amazon.de/Mundschutzmaske-zertifiziert-Atemschutzmasken-hygienische-Einzelverpackung/dp/B08TTYBD3K/ref=zg-bs_sports_1/257-9050733-2865403?pd_rd_w=mB31y&pf_rd_p=f132fd53-9870-459e-8ea1-2187701626ae&pf_rd_r=RXNXS96YT49E0314YSRZ&pd_rd_r=dba2a0eb-efd0-4811-b14d-0a9001b46ad3&pd_rd_wg=fEb7L&pd_rd_i=B08TTYBD3K&psc=1").then(result => {
      expect(result).toBe("https://www.amazon.de/Mundschutzmaske-zertifiziert-Atemschutzmasken-hygienische-Einzelverpackung/dp/B08TTYBD3K/ref=zg-bs_sports_1/257-9050733-2865403?pd_rd_w=mB31y&pf_rd_p=f132fd53-9870-459e-8ea1-2187701626ae&pf_rd_r=RXNXS96YT49E0314YSRZ&pd_rd_r=dba2a0eb-efd0-4811-b14d-0a9001b46ad3&pd_rd_wg=fEb7L&pd_rd_i=B08TTYBD3K&psc=1&tag=helloworldtri-21"); // "should add affiliate tag to url using & seperator"
      done();
    });

    service.createAffiliateLink("https://www.amazon.de/some-product/").then(result => {
      expect(result).toBe("https://www.amazon.de/some-product/?tag=helloworldtri-21"); // should add affiliate tag to url using ? seperator
      done();
    });

    service.createAffiliateLink("https://www.amazon.de/Super-Sparrow-Trinkflasche-Wasserdurchfluss-Wiederverwendbare/dp/B07BJFX6MC/ref=zg-bs_sports_4/257-9050733-2865403?pd_rd_w=75taz&pf_rd_p=f132fd53-9870-459e-8ea1-2187701626ae&pf_rd_r=8G79P6T63YJDSYBXHJKP&pd_rd_r=39ee585c-ec54-492e-bc94-52944c897787&pd_rd_wg=1oggQ&pd_rd_i=B08K6VQNKB&psc=1&tag=some-other-tag").then(result => {
      expect(result).toBe("https://www.amazon.de/Super-Sparrow-Trinkflasche-Wasserdurchfluss-Wiederverwendbare/dp/B07BJFX6MC/ref=zg-bs_sports_4/257-9050733-2865403?pd_rd_w=75taz&pf_rd_p=f132fd53-9870-459e-8ea1-2187701626ae&pf_rd_r=8G79P6T63YJDSYBXHJKP&pd_rd_r=39ee585c-ec54-492e-bc94-52944c897787&pd_rd_wg=1oggQ&pd_rd_i=B08K6VQNKB&psc=1&tag=helloworldtri-21"); // should override affiliate tag from another company in url
      done();
    });

    service.createAffiliateLink("https://www.amazon.com/AmazonBasics-NC1406118R1-Laptop-Tasche-Bildschirmdiagonale-Schwarz/dp/B00LU7B8X0?ref_=ast_sto_dp&th=1&psc=1&tag=helloworldtri-21").then(result => {
      expect(result).toBe("https://www.amazon.com/AmazonBasics-NC1406118R1-Laptop-Tasche-Bildschirmdiagonale-Schwarz/dp/B00LU7B8X0?ref_=ast_sto_dp&th=1&psc=1&tag=helloworldtri-21"); // should avoid duplicated tag params
      done();
    });

    // UNKNOWN

    service.createAffiliateLink("https://www.mmoga.de/Rockstar-Games/Red-Dead-Redemption-2-PC-Version.html").then(result => {
      expect(result).toBe("https://www.mmoga.de/Rockstar-Games/Red-Dead-Redemption-2-PC-Version.html");
      done();
    });
  })

  it('should supports domains from the affiliate programmes', () => {
    expect(service.supportsDomain('nordicnest.de')).toBeTruthy();
    expect(service.supportsDomain('vb-deutschland.de')).toBeTruthy();
    expect(service.supportsDomain('pinkmilk.de')).toBeTruthy();
    expect(service.supportsDomain('littlehipstar.com')).toBeTruthy();
    expect(service.supportsDomain('otto.de')).toBeTruthy();
    expect(service.supportsDomain('hessnatur.com')).toBeTruthy();
    expect(service.supportsDomain('babymarkt.de')).toBeTruthy();
    expect(service.supportsDomain('waschbaer.de')).toBeTruthy();
    expect(service.supportsDomain('pearlco.de')).toBeTruthy();
    expect(service.supportsDomain('aromamanufaktur.com')).toBeTruthy();
    expect(service.supportsDomain('hempamed.de')).toBeTruthy();
    expect(service.supportsDomain('klaraseats.com')).toBeTruthy();
    expect(service.supportsDomain('amazon.de')).toBeTruthy();
    expect(service.supportsDomain('douglas.de')).toBeFalsy();
  })
});
