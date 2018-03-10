import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_ROUTES } from './app-route';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { InstagramModule } from './instagram/instagram.module'
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES),
    InstagramModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
