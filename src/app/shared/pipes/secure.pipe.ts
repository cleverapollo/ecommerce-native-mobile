import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

  transform(src: Blob | string | URL): string | URL {
    if (src instanceof Blob) {
      return URL.createObjectURL(src);
    }
    return src;
  }

}
