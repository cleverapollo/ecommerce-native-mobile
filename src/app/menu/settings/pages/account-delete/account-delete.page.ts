import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '@core/api/user-api.service';
import { DeleteAccountRequest } from '@core/models/user.model';
import { AuthenticationService } from '@core/services/authentication.service';
import { NavController } from '@ionic/angular';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.page.html',
  styleUrls: ['./account-delete.page.scss'],
})
export class AccountDeletePage implements OnInit {

  form: FormGroup;

  get validationMessages(): ValidationMessages {
    return {
      password: [
        new ValidationMessage('required', 'Gib bitte dein Passwort an.')
      ]
    }
  }

  constructor(
    private userApiService: UserApiService, 
    private authService: AuthenticationService,
    private navController: NavController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: this.formBuilder.control('', [Validators.required])
    });
  }

  deleteAccount() {
    const requestBody = new DeleteAccountRequest(this.form.controls);
    this.userApiService.deleteUser(requestBody).toPromise().then(() => {
      this.authService.logout().finally(() => {
        this.navController.navigateRoot('start');
      });
    });
  }

}
