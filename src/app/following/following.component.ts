import { AfterViewInit, Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation, Relationship } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { GramComponent } from '../gram/gram.component';

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
export class FollowingComponent implements OnInit, AfterViewInit {

  inat: InaturalistService;
  following: Relationship[];
  selected!: Relationship | undefined;
  observations!: Observation[];
  loading: boolean;
  intersectionObserver!: IntersectionObserver;
  page: number;

  @ViewChildren('obs') obs!: QueryList<any>;

  constructor(){
    this.loading = false;
    this.page = 1;
    this.inat = inject(InaturalistService);
    this.following = [];
    this.observations = [];
    this.createIntersectionObserver();
  }

  ngOnInit(): void {
    this.inat.getRelationships('').then((relationships:Relationship[])=>{
      this.following = relationships;
      this.loadObservations()
    })
  }

  ngAfterViewInit(): void {
    this.obs.changes.subscribe(this.afterObsRender.bind(this))
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
