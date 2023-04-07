import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorSearchPage } from './creator-search.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorSearchPageRoutingModule {}
