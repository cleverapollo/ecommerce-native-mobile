import { Component, OnInit, Input } from '@angular/core';
import { WishDto } from '@core/models/wish-list.model';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.scss'],
})
export class WishComponent implements OnInit {

  @Input() wish: WishDto;

  constructor() { }

  ngOnInit() {}

}
