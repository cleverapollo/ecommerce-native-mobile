import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BirthdayUpdatePage } from './birthday-update.page';

const routes: Routes = [
  {
    path: '',
    component: BirthdayUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BirthdayUpdatePageRoutingModule {}
