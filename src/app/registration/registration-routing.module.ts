import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationPage } from './registration.page';
import { IntroductionComponent } from './introduction/introduction.component';
import { WishListNameComponent } from './wish-list-name/wish-list-name.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationPage,
    children: [
      {
        path: 'introduction',
        component: IntroductionComponent
      },
      {
        path: 'wish-list-name',
        component: WishListNameComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationPageRoutingModule {}
