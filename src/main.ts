import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import appRoutes from './app/app-routes.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';
import { CustomRouteReuseStrategy } from './app/custom-route-reuse-strategy';
import {  provideHttpClient } from '@angular/common/http'

bootstrapApplication(AppComponent,{
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    {
        provide: RouteReuseStrategy,
        useClass: CustomRouteReuseStrategy
    },
    provideHttpClient()
]
}).catch(err => console.log(err));
