import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstagramComponent } from './instagram/instagram.component';

import { HttpClientModule } from '@angular/common/http';
import { InstagramService } from './instagram.service';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxElectronModule } from 'ngx-electron';

import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { GalleryComponent } from './gallery/gallery.component';
import { PostComponent } from './post/post.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ChartsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxElectronModule,
    RouterModule,
    NgZorroAntdModule
  ],
  declarations: [InstagramComponent, ScorecardComponent, GalleryComponent, PostComponent],
  exports: [InstagramComponent],
  providers: [InstagramService],
  entryComponents: [PostComponent]

})
export class InstagramModule { }
