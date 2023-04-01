import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorIntroTextUpdatePage } from './creator-intro-text-update.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorIntroTextUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorIntroTextUpdatePageRoutingModule {}
