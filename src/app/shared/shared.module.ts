import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurePipe } from './secure.pipe';



@NgModule({
  declarations: [SecurePipe],
  imports: [
    CommonModule
  ],
  exports: [SecurePipe]
})
export class SharedModule { }
