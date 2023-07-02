import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GramComponent } from './gram/gram.component';
import { UserComponent } from './user/user.component';
import { AuthorizationComponent } from './authorization/authorization.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'natureGram'
  },
  {
    path:'authorize',
    component: AuthorizationComponent,
    title: 'Authorize'
  },
  {
    path:':user_login',
    component: UserComponent,
    title:'User'
  }
];

export default routes;