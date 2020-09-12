import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  transform(url): Observable<SafeUrl> {
    if (url) {
      const headers = new HttpHeaders()
        .set('Access-Control-Allow-Origin', '*')
      
      // FIXME: check why server sends http instead https
      let modifiedUrl = url;
      if (environment.production) {
        modifiedUrl = (url as string).replace('http', 'https');
      }

      return this.http
      .get(modifiedUrl, { responseType: 'blob', headers: headers }).pipe(
        map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))),
      );
    }
}

}
