import { TestBed } from '@angular/core/testing';
import { AffiliateProgramme } from '@core/models/affiliate.model';
import { AffiliateDataStoreService } from '../../data/affiliate-data-store.service';

import { AffiliateDefaultService } from './affiliate-default.service';
import { LogService, StubLogService } from '@core/services/log.service';
import { WishListTestData } from '@core/test/wish-list-data';
import { FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';

class MockAffiliateDataStoreService {

  affiliateProgrammes: AffiliateProgramme[] = [];

  constructor(affiliateProgrammes: AffiliateProgramme[]) {
    this.affiliateProgrammes = affiliateProgrammes;
  }
}

describe('AffiliateDefaultService', () => {

  const awinDeeplinkTemplate = 'https://www.awin1.com/cread.php?awinaffid=813821&awinmid=${ADVERTISER_ID}&ued=${ENCODED_PRODUCT_URL}';
  const adcellDeeplinkTemplate = 'https://t.adcell.com/p/click?promoId=${ADVERTISER_ID}&slotId=92263&param0=${ENCODED_PRODUCT_URL}';
  const affiliateProgrammes = [
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
    { advertiserId: '0', deeplinkTemplate: '${PRODUCT_URL}${QUERY_PARAM_SEPERATOR}tag=wantic03-21', validDomains: ['amazon.de', 'amazon.com'] },
    { advertiserId: '0', deeplinkTemplate: 'http://redirect.viglink.com?key=e0562bb177d75be5331216a6971d6bca&u=${ENCODED_PRODUCT_URL}', validDomains: ['*'] },
  ]

  it('should be created', () => {
    const service = configureModule(affiliateProgrammes);
    expect(service).toBeTruthy();
  });

  describe('createAffiliateLink', () => {

    it('should use the product url if something goes wrong', (done) => {
      const service = configureModule([]);
      const unknownProductUrl = 'https://www.some-unknown-url.com/';
      service.createAffiliateLink(unknownProductUrl).then(result => {
        expect(result).toBe(unknownProductUrl);
        done();
      });
    })

    it('should create affiliate links correctly', (done) => {
      const service = configureModule(affiliateProgrammes);

      const unknownProductUrl = 'https://www.some-unknown-url.com/';
      service.createAffiliateLink(unknownProductUrl).then(result => {
        expect(result).toBe('http://redirect.viglink.com?key=e0562bb177d75be5331216a6971d6bca&u=https%3A%2F%2Fwww.some-unknown-url.com%2F');
        done();
      });

      // AWIN

      service.createAffiliateLink('https://www.otto.de/p/taschenfederkernmatratze-senioren-55-plus-delavita-24-cm-hoch-420-federn-mit-sitzkantenverstaerkung-getestete-qualitaet-mit-4-5-sterne-bewertung-448251235/#variationId=448251326').then(result => {
        expect(result).toBe('https://www.awin1.com/cread.php?awinaffid=813821&awinmid=14336&ued=https%3A%2F%2Fwww.otto.de%2Fp%2Ftaschenfederkernmatratze-senioren-55-plus-delavita-24-cm-hoch-420-federn-mit-sitzkantenverstaerkung-getestete-qualitaet-mit-4-5-sterne-bewertung-448251235%2F%23variationId%3D448251326');
        done();
      });

      service.createAffiliateLink('https://www.pearlco.de/wasserfilter-astra-unimax_9').then(result => {
        expect(result).toBe('https://www.awin1.com/cread.php?awinaffid=813821&awinmid=20180&ued=https%3A%2F%2Fwww.pearlco.de%2Fwasserfilter-astra-unimax_9');
        done();
      });

      service.createAffiliateLink('https://www.nordicnest.de/marken/kay-bojesen-denmark/kay-bojesen-affe-klein/?variantId=6322-01').then(result => {
        expect(result).toBe('https://www.awin1.com/cread.php?awinaffid=813821&awinmid=9074&ued=https%3A%2F%2Fwww.nordicnest.de%2Fmarken%2Fkay-bojesen-denmark%2Fkay-bojesen-affe-klein%2F%3FvariantId%3D6322-01');
        done();
      });

      service.createAffiliateLink('https://www.vertbaudet.de/jungen-langarmshirt-mit-grafischem-motiv-blau-wei.htm?ProductId=700260955&FiltreCouleur=6400&t=1').then(result => {
        expect(result).toBe('https://www.awin1.com/cread.php?awinaffid=813821&awinmid=11730&ued=https%3A%2F%2Fwww.vertbaudet.de%2Fjungen-langarmshirt-mit-grafischem-motiv-blau-wei.htm%3FProductId%3D700260955%26FiltreCouleur%3D6400%26t%3D1');
        done();
      });

      // ADCELL

      service.createAffiliateLink('https://aromamanufaktur.com/collections/geschenkideen/products/winter-set-5x10ml-duft-geschenkset-atherische-winter-ole-im-set').then(result => {
        expect(result).toBe('https://t.adcell.com/p/click?promoId=6724&slotId=92263&param0=https%3A%2F%2Faromamanufaktur.com%2Fcollections%2Fgeschenkideen%2Fproducts%2Fwinter-set-5x10ml-duft-geschenkset-atherische-winter-ole-im-set');
        done();
      });

      service.createAffiliateLink('https://hempamed.de/collections/cbd-mundspray/products/hempamed-cbd-mundspray-natur-5').then(result => {
        expect(result).toBe('https://t.adcell.com/p/click?promoId=6619&slotId=92263&param0=https%3A%2F%2Fhempamed.de%2Fcollections%2Fcbd-mundspray%2Fproducts%2Fhempamed-cbd-mundspray-natur-5');
        done();
      });

      service.createAffiliateLink('https://www.klaraseats.com/KAB-554-24V-Stoff-Havanna-schwarz-Heizung-Armlehnen-Kopfstuetze').then(result => {
        expect(result).toBe('https://t.adcell.com/p/click?promoId=4760&slotId=92263&param0=https%3A%2F%2Fwww.klaraseats.com%2FKAB-554-24V-Stoff-Havanna-schwarz-Heizung-Armlehnen-Kopfstuetze');
        done();
      });

      // Amazon

      service.createAffiliateLink('https://www.amazon.de/Mundschutzmaske-zertifiziert-Atemschutzmasken-hygienische-Einzelverpackung/dp/B08TTYBD3K/ref=zg-bs_sports_1/257-9050733-2865403?pd_rd_w=mB31y&pf_rd_p=f132fd53-9870-459e-8ea1-2187701626ae&pf_rd_r=RXNXS96YT49E0314YSRZ&pd_rd_r=dba2a0eb-efd0-4811-b14d-0a9001b46ad3&pd_rd_wg=fEb7L&pd_rd_i=B08TTYBD3K&psc=1').then(result => {
        expect(result).toBe('https://www.amazon.de/Mundschutzmaske-zertifiziert-Atemschutzmasken-hygienische-Einzelverpackung/dp/B08TTYBD3K/ref=zg-bs_sports_1/257-9050733-2865403?pd_rd_w=mB31y&pf_rd_p=f132fd53-9870-459e-8ea1-2187701626ae&pf_rd_r=RXNXS96YT49E0314YSRZ&pd_rd_r=dba2a0eb-efd0-4811-b14d-0a9001b46ad3&pd_rd_wg=fEb7L&pd_rd_i=B08TTYBD3K&psc=1&tag=wantic03-21'); // 'should add affiliate tag to url using & seperator'
        done();
      });

      service.createAffiliateLink('https://www.amazon.de/some-product/').then(result => {
        expect(result).toBe('https://www.amazon.de/some-product/?tag=wantic03-21'); // should add affiliate tag to url using ? seperator
        done();
      });

      service.createAffiliateLink('https://www.amazon.de/Super-Sparrow-Trinkflasche-Wasserdurchfluss-Wiederverwendbare/dp/B07BJFX6MC/ref=zg-bs_sports_4/257-9050733-2865403?pd_rd_w=75taz&pf_rd_p=f132fd53-9870-459e-8ea1-2187701626ae&pf_rd_r=8G79P6T63YJDSYBXHJKP&pd_rd_r=39ee585c-ec54-492e-bc94-52944c897787&pd_rd_wg=1oggQ&pd_rd_i=B08K6VQNKB&psc=1&tag=some-other-tag').then(result => {
        expect(result).toBe('https://www.amazon.de/Super-Sparrow-Trinkflasche-Wasserdurchfluss-Wiederverwendbare/dp/B07BJFX6MC/ref=zg-bs_sports_4/257-9050733-2865403?pd_rd_w=75taz&pf_rd_p=f132fd53-9870-459e-8ea1-2187701626ae&pf_rd_r=8G79P6T63YJDSYBXHJKP&pd_rd_r=39ee585c-ec54-492e-bc94-52944c897787&pd_rd_wg=1oggQ&pd_rd_i=B08K6VQNKB&psc=1&tag=wantic03-21'); // should override affiliate tag from another company in url
        done();
      });

      service.createAffiliateLink('https://www.amazon.com/AmazonBasics-NC1406118R1-Laptop-Tasche-Bildschirmdiagonale-Schwarz/dp/B00LU7B8X0?ref_=ast_sto_dp&th=1&psc=1&tag=wantic03-21').then(result => {
        expect(result).toBe('https://www.amazon.com/AmazonBasics-NC1406118R1-Laptop-Tasche-Bildschirmdiagonale-Schwarz/dp/B00LU7B8X0?ref_=ast_sto_dp&th=1&psc=1&tag=wantic03-21'); // should avoid duplicated tag params
        done();
      });

      // UNKNOWN

      service.createAffiliateLink('https://www.mmoga.de/Rockstar-Games/Red-Dead-Redemption-2-PC-Version.html').then(result => {
        expect(result).toBe('http://redirect.viglink.com?key=e0562bb177d75be5331216a6971d6bca&u=https%3A%2F%2Fwww.mmoga.de%2FRockstar-Games%2FRed-Dead-Redemption-2-PC-Version.html');
        done();
      });
    })
  })

  describe('supportsDomain', () => {
    it('should supports domains from the affiliate programmes', () => {
      const service = configureModule(affiliateProgrammes);

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
  })

  describe('createAffiliateLinkForWish', () => {
    it('should create affiliate link for wish', async() => {
      const service = configureModule(affiliateProgrammes);
      let wish = WishListTestData.wishBoschWasher;
      expect(wish.productUrl).toBe('https://www.otto.de/p/bosch-waschmaschine-4-wan282a8-8-kg-1400-u-min-1214867044/#variationId=1243447578');
      wish = await service.createAffiliateLinkForWish(wish);
      expect(wish.productUrl).toBe('https://www.awin1.com/cread.php?awinaffid=813821&awinmid=14336&ued=https%3A%2F%2Fwww.otto.de%2Fp%2Fbosch-waschmaschine-4-wan282a8-8-kg-1400-u-min-1214867044%2F%23variationId%3D1243447578')
    })

    it('should create affiliate link for shared wish', async() => {
      const service = configureModule(affiliateProgrammes);
      let wish = WishListTestData.dogBowlSharedWish;
      expect(wish.productUrl).toBe('https://www.4nooks.com/produkt/design-hundenapf-juna-sonnengelb-i/');
      wish = (await service.createAffiliateLinkForWish(wish)) as FriendWish;
      expect(wish.productUrl).toBe('http://redirect.viglink.com?key=e0562bb177d75be5331216a6971d6bca&u=https%3A%2F%2Fwww.4nooks.com%2Fprodukt%2Fdesign-hundenapf-juna-sonnengelb-i%2F')
    })
  });

  // Helper

  function configureModule(programmes: AffiliateProgramme[]) {
    TestBed.configureTestingModule({
      providers: [{
        provide: LogService,
        useClass: StubLogService
      }, {
        provide: AffiliateDataStoreService,
        useValue: new MockAffiliateDataStoreService(programmes)
      }]
    });
    return TestBed.inject(AffiliateDefaultService);
  }

});
