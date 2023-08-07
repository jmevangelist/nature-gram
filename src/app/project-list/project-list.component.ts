import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../authorization/authorization.service'
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Project } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { ChipsComponent } from '../chips/chips.component';
import { Chip } from '../chips/chip.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProjectCardComponent,
    IntersectionObserverDirective,
    ChipsComponent,
    ClarityModule,
    FormsModule
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  auth: AuthorizationService;
  inat: InaturalistService;
  projects!: Project[];
  params: any;
  observe: boolean;
  loading: boolean;
  projectListHeadline!: string;
  chips: Chip[];
  sub!: SubscriptionLike;
  q!:string;

  constructor(private activatedRoute:ActivatedRoute, private router:Router){
    this.auth = inject(AuthorizationService);
    this.inat = inject(InaturalistService);
    this.projects = [];
    this.params = {
      page: 1
    }
    this.observe = true;
    this.loading = true;
    this.chips = [];
  }

  ngOnInit(): void {
    let joined:Chip = {
      label: 'Joined'
    }
    let featured:Chip = {
      label: 'Featured'
    }
    let recent:Chip = {
      label: 'Recent'
    }

    if(this.auth.me){
      this.chips.push(joined)
    }
    this.chips.push(featured);
    this.chips.push(recent);

    this.sub = this.activatedRoute.queryParams.subscribe((qP)=>{
      this.chips.forEach(c=>{
        c.selected = false;
      })
      this.params = { page:  1 };

      if(Object.keys(qP).length){
        Object.keys(qP).forEach(k=>{
          this.params[k] = qP[k]
        })
        
        if(qP['featured']){
          featured.selected = true;
        }else if(qP['member_id']){
          joined.selected = true;
        }else if(qP['order_by']=='recent_posts'){
          recent.selected =  true;
        }else if(qP['q']){
          this.q = qP['q']
        }
      }else{
        let chip:Chip = this.auth.me ? joined: featured;
        chip.selected = true;
        this.params = this.buildParams(chip);
      }

      this.projects.length = 0;
      this.observe = true;
      this.getProjects();
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSubmit(){
    this.router.navigate([],{queryParams: {q: this.q}});
  }

  buildParams(c:Chip){
    let params:any = {};

    switch(c.label){  
      case 'Featured':
        params['featured'] = true;  
        params['order_by'] = 'featured';
        break;
      case 'Recent':
        params['order_by'] = 'recent_posts';
        break;
      case 'Joined':
        params['member_id'] = this.auth.me?.id;
        break; 
    }

    return params;
  }

  select(c:Chip){
    this.q = '';
    let params = this.buildParams(c);
    this.router.navigate([],{queryParams: params});
  }

  intersected(){
    this.getProjects();
  }

  getProjects(){
    this.loading = true;
    this.observe = false;

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
