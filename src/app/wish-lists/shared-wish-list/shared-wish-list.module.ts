import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { SharedWishListPageRoutingModule } from './shared-wish-list-routing.module';

import { SharedWishListPage } from './shared-wish-list.page';
import { SharedModule } from '@shared/shared.module';
import { SharedWishComponent } from './shared-wish/shared-wish.component';
import { ReserveWishModalComponent } from './reserve-wish-modal/reserve-wish-modal.component';
import { CancelWishReservationModalComponent } from './cancel-wish-reservation-modal/cancel-wish-reservation-modal.component';
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
    ReserveWishModalComponent,
    CancelWishReservationModalComponent,
    WishReservedModalComponent
  ],
  entryComponents: [ReserveWishModalComponent, CancelWishReservationModalComponent, WishReservedModalComponent]
})
export class SharedWishListPageModule {}
