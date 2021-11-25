import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared/shared.module';
import { FirebaseRouteComponent } from './firebase-route.component';
import { FirebaseRouteRoutingModule } from './firebase-route.routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FirebaseRouteRoutingModule,
    SharedModule
  ],
  declarations: [FirebaseRouteComponent]
})
export class FirebaseRouteModule {}
