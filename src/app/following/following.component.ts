import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation, Relationship } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { GramComponent } from '../gram/gram.component';
import { AuthorizationService } from '../authorization/authorization.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    GramComponent
  ],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit, AfterViewInit, OnDestroy {

  inat: InaturalistService;
  following: Relationship[];
  selected!: Relationship | undefined;
  observations!: Observation[];
  loading: boolean;
  intersectionObserver!: IntersectionObserver;
  page: number;
  auth: AuthorizationService;
  sub!: SubscriptionLike;

  @ViewChildren('obs') obs!: QueryList<any>;

  constructor(){
    this.loading = true;
    this.page = 1;
    this.inat = inject(InaturalistService);
    this.auth = inject(AuthorizationService);
    this.following = [];
    this.observations = [];
    this.createIntersectionObserver();
  }

  ngOnInit(): void {
    if(!this.auth.isExpired){
      this.inat.getRelationships('').then((relationships:Relationship[])=>{
        this.following = relationships;
        this.loadObservations()
      }).catch(()=>{
        this.loading = false;
      })
    }else{
      this.loading = false;
    }
  }

  ngAfterViewInit(): void {
    this.sub = this.obs.changes.subscribe(this.afterObsRender.bind(this))
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  afterObsRender(): void{
    let last = document.querySelector('.last');
    if(last){this.intersectionObserver.observe(last)};
  }

  trackByItems(index: number, obs: Observation): number { return obs.id; }

  select(following:Relationship){
    if(this.selected==following){
      this.selected = undefined;
    }else{
      this.selected = following;
    }
    this.reload();
  }

  reload(){
    this.observations = [];
    this.page = 1;
    this.loadObservations();
  }

  loadObservations(){
    this.loading = true;
    let ids = this.following.map((f)=>f.friend_user.id)
    if(this.selected){
      ids = [this.selected.friend_user.id]
    }

    let params = [
      ['user_id',ids.toString()],
      ['order_by','created_at'],
      ['per_page','10'],
      ['page',this.page.toString()]
    ];
    
    this.inat.getObservations(params).then((obs:Observation[])=>{
      this.observations.push(...obs);
    }).finally(()=>{
      this.loading = false;
      this.page++;
    })
  }

  createIntersectionObserver(){
    const options = {
      rootMargin: '0px',
      threshold: 0.05
    }

    this.intersectionObserver = new IntersectionObserver((entries,observer)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          this.loadObservations()
          observer.unobserve(entry.target)
        }
      })
    })
  }

}
