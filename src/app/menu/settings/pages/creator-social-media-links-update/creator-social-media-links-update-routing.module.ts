import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorSocialMediaLinksUpdatePage } from './creator-social-media-links-update.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorSocialMediaLinksUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorSocialMediaLinksUpdatePageRoutingModule {}
