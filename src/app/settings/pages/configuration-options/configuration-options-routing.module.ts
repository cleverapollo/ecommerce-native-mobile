import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigurationOptionsPage } from './configuration-options.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationOptionsPageRoutingModule {}
