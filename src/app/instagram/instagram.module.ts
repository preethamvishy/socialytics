import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstagramComponent } from './instagram/instagram.component';

import { HttpClientModule } from '@angular/common/http';
import { InstagramService } from './instagram.service';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ChartsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxElectronModule
  ],
  declarations: [InstagramComponent],
  exports: [InstagramComponent],
  providers: [InstagramService]

})
export class InstagramModule { }
