import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileImageUpdatePage } from './profile-image-update.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileImageUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileImageUpdatePageRoutingModule {}
