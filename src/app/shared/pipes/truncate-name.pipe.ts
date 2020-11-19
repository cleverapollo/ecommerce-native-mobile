import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateName'
})
export class TruncateNamePipe implements PipeTransform {

  transform(name: string | String): any {
    const limit = 30
    return name.length > limit ? `${name.substring(0, limit)} ...` : name;
  }

}
