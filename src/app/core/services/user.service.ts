import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private facebook: Facebook) { }

  get facebookUserProfile(): Promise<any> {
    return this.facebook.getCurrentProfile();
  }

}
