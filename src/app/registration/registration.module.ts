import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';
import { IntroductionComponent } from './introduction/introduction.component';
import { WishListNameComponent } from './wish-list-name/wish-list-name.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistrationPageRoutingModule
  ],
  declarations: [RegistrationPage, IntroductionComponent, WishListNameComponent]
})
export class RegistrationPageModule {}
