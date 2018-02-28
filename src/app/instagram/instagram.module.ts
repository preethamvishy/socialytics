import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstagramComponent } from './instagram/instagram.component';

import { HttpClientModule } from '@angular/common/http';
import { InstagramService } from './instagram.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [InstagramComponent],
  exports: [InstagramComponent],
  providers: [InstagramService]

})
export class InstagramModule { }
