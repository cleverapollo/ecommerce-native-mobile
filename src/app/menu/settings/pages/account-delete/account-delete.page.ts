import { Component, OnInit } from '@angular/core';
import { UserApiService } from '@core/api/user-api.service';
import { AuthenticationService } from '@core/services/authentication.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.page.html',
  styleUrls: ['./account-delete.page.scss'],
})
export class AccountDeletePage implements OnInit {

  constructor(
    private userApiService: UserApiService, 
    private authService: AuthenticationService,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  deleteAccount() {
    this.userApiService.deleteUser().toPromise().then(() => {
      this.authService.logout().finally(() => {
        this.navController.navigateRoot('start');
      });
    });
  }

}
