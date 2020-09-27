import { Pipe, PipeTransform } from '@angular/core';
import { CacheImageService } from '@core/services/cache-image.service';
import { Observable } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'cacheImage'
})
export class CacheImagePipe implements PipeTransform {

  constructor(private cacheImageService: CacheImageService, private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(url: String): Promise<SafeUrl> {
    return new Promise((resolve, reject) => {
      const fileName = url.substring(url.lastIndexOf('/') + 1);
      this.cacheImageService.loadImage(fileName).then((blob) => {
        console.log('load from cache', blob, this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)));
        resolve(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)));
      }).catch( e => {
        this.loadImageFromServer(url).then(blob => {
          console.log('load from server', this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)));
          this.cacheImageService.saveImage(fileName, blob);
          resolve(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)));
        }).catch(reject);
      });
    });
  }

  private loadImageFromServer(url) {
    if (url) {
      const headers = new HttpHeaders()
        .set('Access-Control-Allow-Origin', '*')
      
      // FIXME: check why server sends http instead https
      let modifiedUrl = url;
      if (environment.production) {
        modifiedUrl = (url as string).replace('http', 'https');
      }

      return this.http.get(modifiedUrl, { responseType: 'blob', headers: headers }).toPromise();
    }
  }

}
