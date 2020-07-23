import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.page.html',
  styleUrls: ['./account-delete.page.scss'],
})
export class AccountDeletePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  deleteAccount() {
    console.log('account deleted');
  }

}
