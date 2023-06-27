import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import routes from './app/app-routing.module';

bootstrapApplication(AppComponent,{
  providers: [
    provideRouter(routes),
  ]
}).catch(err => console.log(err));
