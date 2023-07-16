import { Component, Input, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation, User } from '../inaturalist/inaturalist.interface';
import { ClarityModule } from '@clr/angular'
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,ClarityModule,HeaderComponent,RouterLink],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  inaturalistService: InaturalistService = inject(InaturalistService)

  user_login: string = ''
  observations: Observation[] = []
  user: User|undefined = undefined;

  private observer: IntersectionObserver | undefined;
  private page = 1

  @ViewChildren('obs') obs!: QueryList<any>;

  constructor(){
    this.createObserver()
    this.user_login = this.route.snapshot.params['user_login'];
    this.getObservations();
    this.inaturalistService.getUserByLogin(this.user_login)
    .then( (user:User | undefined) => {
      this.user = user
    })
  }

  ngAfterViewInit(){
    this.obs.changes.subscribe(t=>{
      this.obsRendered(t)
    })
  }

  obsRendered(t:any){
    this.observer?.observe(t.last.nativeElement)
  }

  private getObservations(){
    this.inaturalistService.getObservations([
      ['user_login',this.user_login],
      ['page',this.page.toString()]])
    .then( (observations:Observation[]) => {
      this.observations.push(...observations);
      this.page++
    })
  }

  private createObserver(){
    const options = {
      rootMargin: '0px',
      threshold: 0.05
    }

    this.observer = new IntersectionObserver((entries,observer)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          this.getObservations()
          observer.unobserve(entry.target)
        }
      })
    })
  }

}
