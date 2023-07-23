import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation, User } from '../inaturalist/inaturalist.interface';
import { ClarityModule, ClrLoadingButton, ClrLoadingState } from '@clr/angular'
import { HeaderComponent } from '../header/header.component';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { UrlifyDirective } from '../shared/urlify.directive';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    HeaderComponent,
    RouterLink,
    IntersectionObserverDirective,
    UrlifyDirective
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  inaturalistService: InaturalistService = inject(InaturalistService)

  user_login: string = ''
  observations: Observation[] = []
  user: User|undefined = undefined;
  following: boolean;
  relationshipID!: number | undefined;
  private page = 1
  observe: boolean = true;

  constructor(){
    this.user_login = this.route.snapshot.params['user_login'];
    this.following = false;
    this.inaturalistService.getUserByLogin(this.user_login)
    .then( (user:User | undefined) => {
      this.user = user
      console.log(this.user)
    })
  }

  intersected(){
    console.log('intersected')
    this.getObservations();
  }

  ngOnInit(): void {
    this.inaturalistService.getRelationships(this.user_login).then((r:any)=>{
      console.log(r)
      if(r.length){
        if(r[0].following){
          this.following = true;
          this.relationshipID = r[0].id;
        }
      }
    })
  }

  follow(button:ClrLoadingButton){
    button.loadingStateChange(ClrLoadingState.LOADING);
    if(this.following){
      this.inaturalistService.relationships(this.relationshipID).then(()=>{
        this.following = false;
        this.relationshipID = undefined;
      }).finally(()=>{
        button.loadingStateChange(ClrLoadingState.DEFAULT)
      })
    }else{
      this.inaturalistService.relationships(
        {'friend_id':this.user?.id,'following':true,'trust':false}).then((res)=>{
          console.log(res)
          this.following = true;
          this.relationshipID = res[0].id;
        }).finally(()=>{
          button.loadingStateChange(ClrLoadingState.DEFAULT)
        })
      
    }
  }

  private getObservations(){
    this.inaturalistService.getObservations([
      ['user_login',this.user_login],
      ['page',this.page.toString()]])
    .then( (observations:Observation[]) => {
      if(observations.length == 0){
        this.observe = false;
      }else{
        this.observations.push(...observations);
        this.page++
      }
    })
  }

}
