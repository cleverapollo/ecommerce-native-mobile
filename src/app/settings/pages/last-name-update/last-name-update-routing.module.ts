import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LastNameUpdatePage } from './last-name-update.page';

const routes: Routes = [
  {
    path: '',
    component: LastNameUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LastNameUpdatePageRoutingModule {}
