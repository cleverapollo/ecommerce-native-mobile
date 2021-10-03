import { Component, OnInit, Input } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.scss'],
})
export class WishComponent implements OnInit {

  @Input() wish: WishDto;
  @Input() showReservedWishes: boolean;

  get showReservedState(): boolean {
    return this.showReservedWishes && this.wish.isReserved;
  }

  constructor() { }

  ngOnInit() {}

  onImgLoadingError(event) {
    event.target.src = 'assets/images/wish-list-placeholder.svg';
    event.target.alt = 'Das Bild zeigt ein Quadrat mit einem Fragezeichen. Es stellt dar, dass es einen Fehler beim Laden des Bildes gegeben hat.';
  }

}
