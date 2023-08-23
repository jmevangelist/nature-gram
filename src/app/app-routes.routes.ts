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
import { FollowingListComponent } from './following-list/following-list.component';
import { TaxonInfoComponent } from './taxon-info/taxon-info.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { ProjectInfoComponent } from './projects/project-info/project-info.component';
import { SearchComponent } from './search/search.component';

const appRoutes: Routes = [
  {
    path: '',redirectTo: '/home', pathMatch: 'full' },
  {
    path:'home',
    component: HomeComponent,
    title: 'natureGram',
    data:{
      saveComponent: true,
      root: true
    }
  },
  {
    path:'home/preference',
    component: PreferenceComponent,
    title: 'Preference'
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
    path:'naturalist/:user_login',
    component: UserComponent,
    title:'User',
    data:{
      saveComponent: true
    }
  },
  {
    path:'notifications',
    component: NotificationComponent,
    title:'Notifications'
  },
  {
    path:'observation/:uuid',
    component: ObservationComponent,
    title:'Observation',
    data:{
      saveComponent: true
    }
  },{
    path:'map',
    component: MapComponent,
    title:'Map'
  },
  {
    path:'following',
    component: FollowingComponent,
    title:'Following',
    data:{
      saveComponent: true
    }
  },
  {
    path: 'following-list',
    component: FollowingListComponent,
    title: 'Following'
  },
  {
    path:'taxon/:id',
    component: TaxonInfoComponent,
    title: 'Taxon',
    data:{
      saveComponent: true
    }
  },
  {
    path:'projects',
    component: ProjectsComponent,
    title: 'Projects',
    children: [
      {
        path: '',
        component: ProjectListComponent,
        title: 'Projects',
        data:{
          saveComponent: true
        }
      },
      {
        path: ':slug',
        component: ProjectInfoComponent,
        title: 'Project',
        data:{
          saveComponent: true
        }
      }
    ]
  },{
    path:'search',
    component: SearchComponent,
    title: 'Search',
    data:{
      saveComponent: true
    }
  },
  {
    path:'search/:source',
    component: SearchComponent,
    title: 'Search',
    data:{
      saveComponent: true
    }
  }
];

export default appRoutes;