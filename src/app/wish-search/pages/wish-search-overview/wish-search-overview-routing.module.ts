import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchOverviewPage } from './wish-search-overview.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchOverviewPage
  },
  {
    path: 'search-by-amazon',
    loadChildren: () => import('@wishSearch/pages/amazon/amazon-search-results/amazon-search-results.module')
      .then( m => m.WishSearchResultsPageModule)
  },
  {
    path: 'search-by-url',
    children: [
      {
        path: 'select-image',
        loadChildren: () => import('@wishSearch/pages/url/wish-search-url-result-images/wish-search-url-result-images.module')
          .then( m => m.WishSearchUrlResultImagesPageModule)
      },
      {
        path: 'edit-details',
        loadChildren: () => import('@wishSearch/pages/url/wish-search-url-result-details/wish-search-url-result-details.module')
          .then( m => m.WishSearchUrlResultDetailsPageModule)
      },
      {
        path: 'select-wish-list',
        loadChildren: () => import('@wishSearch/pages/url/wish-search-url-result-wish-list/wish-search-url-result-wish-list.module')
          .then( m => m.WishSearchUrlResultWishListPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchSelectionPageRoutingModule {}
