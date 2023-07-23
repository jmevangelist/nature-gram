import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { PreferenceComponent } from './preference/preference.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { NotificationComponent } from './notification/notification.component';
import { ObservationComponent } from './observation/observation.component';
import { MapComponent } from './map/map.component';
import { FollowingComponent } from './following/following.component';

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
  {
    path:'notifications',
    component: NotificationComponent,
    title:'Notifications'
  },
  {
    path:'observation/:uuid',
    component: ObservationComponent,
    title:'Observation'
  },{
    path:'map',
    component: MapComponent,
    title:'Map'
  },
  {
    path:'following',
    component: FollowingComponent,
    title:'Following'
  }
];

export default appRoutes;