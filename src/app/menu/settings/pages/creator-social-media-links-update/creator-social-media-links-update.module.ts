import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorSocialMediaLinksUpdatePageRoutingModule } from './creator-social-media-links-update-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorSocialMediaLinksUpdatePage } from './creator-social-media-links-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorSocialMediaLinksUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorSocialMediaLinksUpdatePage]
})
export class CreatorSocialMediaLinksUpdatePageModule { }
