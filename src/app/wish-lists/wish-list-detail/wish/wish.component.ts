import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.scss'],
})
export class WishComponent {

  @Input() wish: WishDto;
  @Input() showReservedWishes: boolean;

  @Output() selected = new EventEmitter<void>()

  get showReservedState(): boolean {
    return this.showReservedWishes && this.wish.isReserved;
  }

  get imgStyles(): WishImageComponentStyles {
    return {
      img: {
        'min-height': '107px',
        'max-height': '245px'
      }
    }
  }

  constructor() { }

  itemClick() {
    this.selected.emit();
  }

}
