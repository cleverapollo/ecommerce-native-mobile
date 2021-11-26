import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirebaseRouteComponent } from './firebase-route.component';

const routes: Routes = [
  {
    path: '',
    component: FirebaseRouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirebaseRouteRoutingModule {}
