import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '@core/models/user.model';
@Pipe({
  name: 'ownerNames'
})
export class OwnerNamesPipe implements PipeTransform {

  transform(owners: UserDto[], separator: string = '&', namePostfix: string = ''): string {
    return owners?.map(o => `${o.firstName}${namePostfix}`).join(` ${separator} `);
  }

}
