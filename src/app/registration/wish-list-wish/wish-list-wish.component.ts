import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wish-list-wish',
  templateUrl: './wish-list-wish.component.html',
  styleUrls: ['./wish-list-wish.component.scss'],
})
export class WishListWishComponent implements OnInit {

  keywords: String

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

  search() {
    this.router.navigate(['../search-results'], { relativeTo: this.activatedRoute, queryParams: { keywords: this.keywords } })
  }

}
