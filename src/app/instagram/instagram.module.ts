import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstagramComponent } from './instagram/instagram.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InstagramComponent],
  exports: [InstagramComponent]

})
export class InstagramModule { }
