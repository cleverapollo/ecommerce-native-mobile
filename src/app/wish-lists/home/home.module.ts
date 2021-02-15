import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SharedModule } from '@shared/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { OnboardingSlidesComponent } from './onboarding-slides/onboarding-slides.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule
  ],
  declarations: [HomePage, OnboardingSlidesComponent]
})
export class HomePageModule {}
