import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SharedWishListPageRoutingModule } from './shared-wish-list-routing.module';

import { SharedWishListPage } from './shared-wish-list.page';
import { SharedModule } from '@shared/shared.module';
import { SharedWishComponent } from './shared-wish/shared-wish.component';
import { WishReservedModalComponent } from './wish-reserved-modal/wish-reserved-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedWishListPageRoutingModule,
    SharedModule
  ],
  declarations: [
    SharedWishListPage, 
    SharedWishComponent, 
    WishReservedModalComponent
  ],
  entryComponents: [WishReservedModalComponent]
})
export class SharedWishListPageModule {}
