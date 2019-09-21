import { AppComponent } from './app.component';
import { Routes } from '@angular/router';
import { InstagramComponent } from './instagram/instagram/instagram.component';



export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'instagram', pathMatch: 'full' },
  {
    path: 'instagram', component: InstagramComponent, children: [{
      path: '', component: InstagramComponent
    }, {
      path: '**', redirectTo: '',
    }]
  },
  { path: '**', redirectTo: '' }

];
