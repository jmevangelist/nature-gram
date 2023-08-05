import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../authorization/authorization.service'
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Project } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';


@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProjectCardComponent,
    IntersectionObserverDirective
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {
  auth: AuthorizationService;
  inat: InaturalistService;
  projects!: Project[];
  params: any;
  observe: boolean;
  loading: boolean;
  projectListHeadline!: string;

  constructor(){
    this.auth = inject(AuthorizationService);
    this.inat = inject(InaturalistService);
    this.projects = [];
    this.params = {
      page: 1
    }
    this.observe = true;
    this.loading = true;
  }

  intersected(){
    this.getProjects();
  }

  getProjects(){
    this.loading = true;
    this.observe = false;

    if(this.auth.me){
      this.params['member_id'] = this.auth.me.id;
      this.projectListHeadline = 'Joined';
    }else{
      this.projectListHeadline = 'Featured'
      this.params['features'] = true;
      this.params['order_by'] = 'featured';
    }

    let paramsArr = Object.keys(this.params).map((key) => [key, this.params[key].toString()]);

    this.inat.getProjects(paramsArr).then((projects:Project[])=>{
      if(projects.length){
        this.projects.push(...projects);
        this.params.page++
        this.observe = true;
      }else{
        this.observe = false;
      }
    }).finally(()=>{
      this.loading = false;
    })

  }
}
