import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observation, Project } from '../inaturalist/inaturalist.interface';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { UrlifyDirective } from '../shared/urlify.directive';
import { SquareGridDirective } from '../shared/square-grid.directive';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent,
    UrlifyDirective,
    SquareGridDirective
  ],
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {
  slug!: string;
  project: Project | undefined;
  inat: InaturalistService;
  observations: Observation[] | undefined;
  bgUrl: string;

  constructor(private route: ActivatedRoute,private location:Location){
    this.bgUrl = this.location.prepareExternalUrl('/assets/') + 'wave-bg.png';
    this.slug = this.route.snapshot.params['slug'];
    this.inat = inject(InaturalistService);
  }

  ngOnInit(): void {
    this.getProjectDetail().then((project:Project|null)=>{
      if(project){
        this.project = project;
        this.getRecentObs();
      }
    })
  }

  async getProjectDetail(page?:number):Promise<Project|null>{
    if(!page){page = 1; console.log(page)}
    let projects:Project[] = await this.inat.getProjects([['q',this.slug],['page',page.toString()]])
    let project:Project|undefined = projects.find( p=>p.slug == this.slug);
    if(project){
      return project
    }else if(projects.length){
      page++
      return this.getProjectDetail(page)
    }else{
      return null
    }
  }

  getRecentObs(){
    let params = [['project_id',this.project?.id.toString() || ''],
    ['order_by','created_at']]
    this.inat.getObservations(params).then((obs:Observation[])=>{
      this.observations = obs;
    })
  }
}
