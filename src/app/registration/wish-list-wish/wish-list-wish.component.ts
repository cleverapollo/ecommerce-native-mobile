import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wish-list-wish',
  templateUrl: './wish-list-wish.component.html',
  styleUrls: ['./wish-list-wish.component.scss'],
})
export class WishListWishComponent implements OnInit {

  @Output() onKeyWordChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  onInputChanged(event: CustomEvent) {
    this.onKeyWordChange.emit(event.detail.value);
  }

}
