import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordPageModule } from './change-password/change-password.module';
import { ResetPasswordPageModule } from './reset-password/reset-password.module';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChangePasswordPageModule,
    ForgotPasswordRoutingModule,
    ResetPasswordPageModule
  ]
})
export class ForgotPasswordModule { }
