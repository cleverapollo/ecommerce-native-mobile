import { TestBed } from '@angular/core/testing';

import { WebPageCrawlerService } from './web-page-crawler.service';

describe('WebPageCrawlerService', () => {
  let service: WebPageCrawlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebPageCrawlerService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
