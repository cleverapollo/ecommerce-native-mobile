import { Component, Input } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.scss'],
})
export class WishComponent {

  @Input() wish: WishDto;
  @Input() showReservedWishes: boolean;

  get showReservedState(): boolean {
    return this.showReservedWishes && this.wish.isReserved;
  }

  constructor() { }

}
