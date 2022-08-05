import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Logger } from '@core/services/log.service';
import { DefaultPlatformService } from '../platform.service';

@Injectable({
  providedIn: 'root'
})
export class AffiliateDouglasService implements AffiliateService {

  private static DOUGLAS_DOMAIN = 'douglas.de'
  private static WANTIC_AFFILIATE_ID = '813821';
  private static DOUGLAS_AWIN_PROGRAM_ID = '10076';

  constructor(private httpClient: HttpClient, private logger: Logger, private platformService: DefaultPlatformService) { }

  supportsDomain(domain: string): boolean {
    return domain === AffiliateDouglasService.DOUGLAS_DOMAIN
      && this.platformService.isNativePlatform // web request is blocked by CORS;
  }

  createAffiliateLink(productUrlString: string): Promise<string> {
    if (!productUrlString.includes(AffiliateDouglasService.DOUGLAS_DOMAIN)) {
      return Promise.resolve(productUrlString);
    }
    return this.generateAffilateLink(productUrlString);
  }

  private generateAffilateLink(productUrlString: string): Promise<string> {
    return new Promise((resolve) => {
      const requestURL = this.createRequestURL(productUrlString);
      this.httpClient.get(requestURL, {
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        },
        responseType: 'text'
      }).pipe(first()).subscribe( generatorResult => {
        generatorResult = this.removeImageElementsFromGeneratorResult(generatorResult);
        const affiliateLink = this.parseAffiliateLinkFromGeneratorResult(generatorResult);
        if (affiliateLink === null) {
          resolve(productUrlString);
        } else {
          resolve(affiliateLink);
        }
      }, error => {
        this.logger.error(error);
        resolve(productUrlString);
      })
    })
  }

  private createRequestURL(productUrlString: string) {
    const encodedURL = encodeURIComponent(productUrlString);
    const encodedClickTagURL = encodeURIComponent(`https://www.awin1.com/awclick.php?gid=362940&mid=${AffiliateDouglasService.DOUGLAS_AWIN_PROGRAM_ID}&awinaffid=${AffiliateDouglasService.WANTIC_AFFILIATE_ID}&linkid=2383202&clickref=&clickref2=&p=`);
    return `http://adgenerator.nonstoppartner.net/?clientURL=${encodedURL}&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=${encodedClickTagURL}&nw=fiw1`;
  }

  private removeImageElementsFromGeneratorResult(generatorResult: string) {
    return generatorResult.replace(/<img[^>]*>/g,'');
  }

  private parseAffiliateLinkFromGeneratorResult(generatorResult: string): string | null {
    const resultAsHtml = this.createHTMLElementFromHTMLString(generatorResult);
    const textareas = resultAsHtml.getElementsByTagName('textarea');
    let result: string | null = null;

    for (const textarea of textareas) {
      const decodedAnchorHTMLString = textarea.innerHTML
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\\"/g, '"');

      if (decodedAnchorHTMLString.includes('<a') && decodedAnchorHTMLString.includes('</a>')) {
        const anchor = this.createHTMLAnchorElementFromHTMLString(decodedAnchorHTMLString);
        if (anchor && anchor.href && this.isValidAffiliateURL(anchor.href)) {
          result = anchor.href;
          break;
        }
      }
    }

    return result;
  }

  private isValidAffiliateURL(urlString: string): boolean {
    const wanticAffiliateId = '813821';
    const douglasAwinProgramId = '10076';
    try {
      const url = new URL(urlString);
      return url.searchParams.has('gid') && url.searchParams.has('linkid') &&
        url.searchParams.has('mid') && url.searchParams.get('mid') === douglasAwinProgramId &&
        url.searchParams.has('awinaffid') && url.searchParams.get('awinaffid') === wanticAffiliateId;
    } catch (error) {
      return false;
    }
  }

  private createHTMLElementFromHTMLString(htmlString: string): HTMLElement {
    const htmlElement = document.createElement('html');
    htmlElement.innerHTML = htmlString.trim();
    return htmlElement;
  }

  private createHTMLAnchorElementFromHTMLString(htmlString: string): HTMLAnchorElement {
    const htmlElement = document.createElement('div');
    htmlElement.innerHTML = htmlString.trim();
    return htmlElement.firstChild as HTMLAnchorElement;
  }

}
