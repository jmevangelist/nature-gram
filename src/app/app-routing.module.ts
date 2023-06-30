import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GramComponent } from './gram/gram.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'natureGram'
  },
  {
    path:':user_login',
    component: UserComponent,
    title:'User'
  }
];

export default routes;