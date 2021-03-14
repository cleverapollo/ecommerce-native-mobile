import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-completed',
  templateUrl: './registration-completed.page.html',
  styleUrls: ['./registration-completed.page.scss'],
})
export class RegistrationCompletedPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  navToWishListOverview() {
    console.log('click')
    this.router.navigateByUrl('/secure/home/wish-list-overview', { replaceUrl: true });
  }

}
