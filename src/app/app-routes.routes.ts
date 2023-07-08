import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { PreferenceComponent } from './preference/preference.component';
import { BookmarkComponent } from './bookmark/bookmark.component';

const appRoutes: Routes = [
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
    path:'bookmark',
    component: BookmarkComponent,
    title: 'Bookmarks'
  },
  {
    path:'preference',
    component: PreferenceComponent,
    title: 'Preference'
  },
  {
    path:'naturalist/:user_login',
    component: UserComponent,
    title:'User'
  },
];

export default appRoutes;