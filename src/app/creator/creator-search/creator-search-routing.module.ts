import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreatorSearchPage } from './creator-search.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorSearchPage,
  },
  {
    path: ':userName',
    loadChildren: () => import('./../creator-detail/creator-detail.module').then(m => m.CreatorDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorSearchPageRoutingModule { }
