import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileSettingsFirstnamePage } from './profile-settings-firstname.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileSettingsFirstnamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileSettingsFirstnamePageRoutingModule {}
