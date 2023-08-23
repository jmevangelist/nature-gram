import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../inaturalist/inaturalist.interface';
import { InaturalistService } from '../../inaturalist/inaturalist.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ObservationGridComponent } from 'src/app/observation-grid/observation-grid.component';
import { TaxonomyComponent } from 'src/app/taxonomy/taxonomy.component';
import { KeyValue } from 'src/app/shared/generic.interface';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent,
    ObservationGridComponent,
    TaxonomyComponent
  ],
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {
  slug!: string;
  project: Project | undefined;
  inat: InaturalistService;
  bgUrl: string;
  obsQuery:KeyValue;
  taxonID!: number;
  shortDescription!: string;

  constructor(private route: ActivatedRoute,private location:Location){
    this.bgUrl = this.location.prepareExternalUrl('/assets/') + 'wave-bg.png';
    this.slug = this.route.snapshot.params['slug'];
    this.inat = inject(InaturalistService);
    this.obsQuery = {};
  }

  ngOnInit(): void {
    this.getProjectDetail().then((project:Project|null)=>{
      if(project){
        this.project = project;
        this.obsQuery['project_id'] = project.id;
        this.shortDescription = project.description.slice(0,project.description.indexOf('\n'))
      }
    })
    this.route.queryParams.subscribe(qP=>{
      this.obsQuery = {
        project_id: this.project?.id
      }

      Object.keys(qP).forEach((k:string)=>{
        this.obsQuery[k] = qP[k];
      })

      if(this.obsQuery['taxon_id']){
        this.taxonID = Number(this.obsQuery['taxon_id']);
      }else if(this.obsQuery['identified'] === 'false'){
        this.taxonID = -1;
      }else{
        this.taxonID = 0;
      }
    })
  }

  async getProjectDetail(page?:number):Promise<Project|null>{
    if(!page){page = 1}
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


}
