import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService) {}

  canActivate(): boolean | Promise<boolean>  {
    return this.authService.isAuthenticated;
  }
}
