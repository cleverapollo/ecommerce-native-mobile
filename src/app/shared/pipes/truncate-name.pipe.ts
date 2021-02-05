import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateName'
})
export class TruncateNamePipe implements PipeTransform {

  transform(name: string | String, limit: number = 30): any {
    return name.length > limit ? `${name.substring(0, limit)} ...` : name;
  }

}
