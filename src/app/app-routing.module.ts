import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GramComponent } from './gram/gram.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'natureGram'
  }
];

export default routes;