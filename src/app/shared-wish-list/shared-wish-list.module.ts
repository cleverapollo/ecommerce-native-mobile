import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedWishListPageRoutingModule } from './shared-wish-list-routing.module';

import { SharedWishListPage } from './shared-wish-list.page';
import { SharedModule } from '../shared/shared.module';
import { SharedWishComponent } from './shared-wish/shared-wish.component';
import { GiveSharedWishModalComponent } from './give-shared-wish-modal/give-shared-wish-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SharedWishListPageRoutingModule,
    SharedModule
  ],
  declarations: [SharedWishListPage, SharedWishComponent, GiveSharedWishModalComponent],
  entryComponents: [GiveSharedWishModalComponent]
})
export class SharedWishListPageModule {}
