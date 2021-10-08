import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class AffiliateDouglasService {

  private static DOUGLAS_DOMAIN = 'douglas.de'

  constructor(private httpClient: HttpClient, private logger: LogService) { }

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
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        },
        responseType: 'text'
      }).pipe(first()).subscribe( generatorResult => {
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
    return `http://adgenerator.nonstoppartner.net/?clientURL=${productUrlString}&linkText=Test&zpar0=&zpar1=&language=de&client=douglas&l=de&clicktag=https://www.awin1.com/awclick.php?gid=362940&mid=10076&awinaffid=813821&linkid=2383202&clickref=&clickref2=&p=&nw=fiw1`;
  }

  private parseAffiliateLinkFromGeneratorResult(generatorResult: string): string | null {
    const resultAsHtml = this.createHTMLElementFromHTMLString(generatorResult);
    const textareas = resultAsHtml.getElementsByTagName('textarea');
    let result: string | null = null;
    
    for (let textarea of textareas) {
      const decodedAnchorHTMLString = textarea.innerHTML
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\\"/g, '"');

      if (decodedAnchorHTMLString.includes('<a') && decodedAnchorHTMLString.includes('</a>')) {
        const anchor = this.createHTMLAnchorElementFromHTMLString(decodedAnchorHTMLString);
        if (anchor && anchor.href) {
          result = anchor.href;
          break;
        }
      }
    }

    return result;
  }

  private createHTMLElementFromHTMLString(htmlString: string): HTMLElement {
    let htmlElement = document.createElement('html');
    htmlElement.innerHTML = htmlString.trim();
    return htmlElement;
  }

  private createHTMLAnchorElementFromHTMLString(htmlString: string): HTMLAnchorElement {
    let htmlElement = document.createElement('div');
    htmlElement.innerHTML = htmlString.trim();
    return htmlElement.firstChild as HTMLAnchorElement;
  }

}
