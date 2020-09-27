import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailUpdatePage } from './email-update.page';

const routes: Routes = [
  {
    path: '',
    component: EmailUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailUpdatePageRoutingModule {}
