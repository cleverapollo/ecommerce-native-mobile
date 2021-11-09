import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {

  @Input() src: string;
  @Input() alt: string;
  @Input() imgClass: string;

  get fallbackImageUrl(): string {
    return 'assets/images/wish-list-placeholder.svg';
  } 

  get placeholderAltText(): string {
    return 'Das Bild zeigt ein Quadrat mit einem Fragezeichen. Es stellt dar, dass es einen Fehler beim Laden des Bildes gegeben hat.';
  }

  constructor() {}

  ngOnInit() { }

  onError(event) {
    event.target.src = this.fallbackImageUrl;
    event.target.alt = this.placeholderAltText;
  }

}
