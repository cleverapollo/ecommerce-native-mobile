import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurePipe } from './secure.pipe';
import { OwnerNamesPipe } from './pipes/owner-names.pipe';



@NgModule({
  declarations: [SecurePipe, OwnerNamesPipe],
  imports: [
    CommonModule
  ],
  exports: [SecurePipe, OwnerNamesPipe]
})
export class SharedModule { }
