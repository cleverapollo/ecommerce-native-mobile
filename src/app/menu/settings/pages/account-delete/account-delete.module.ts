import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountDeletePageRoutingModule } from './account-delete-routing.module';

import { AccountDeletePage } from './account-delete.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AccountDeletePageRoutingModule
  ],
  declarations: [AccountDeletePage]
})
export class AccountDeletePageModule {}
