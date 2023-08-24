import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation, Relationship } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { GramComponent } from '../gram/gram.component';
import { AuthorizationService } from '../authorization/authorization.service';
import { SubscriptionLike } from 'rxjs';
import { UrlifyDirective } from '../shared/urlify.directive';
import { ObservationsComponent } from '../observations/observations.component';
import { KeyValue } from '../shared/generic.interface';
import { Chip } from '../chips/chip.interface';
import { ChipsComponent } from '../chips/chips.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    GramComponent,
    UrlifyDirective,
    ObservationsComponent,
    ChipsComponent
  ],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  inat: InaturalistService;
  following: Relationship[];
  selected!: Relationship | undefined;
  auth: AuthorizationService;
  sub!: SubscriptionLike;
  params: KeyValue;
  filterChips: Chip[];

  constructor(private router:Router,private activatedRoute:ActivatedRoute){
    this.inat = inject(InaturalistService);
    this.auth = inject(AuthorizationService);
    this.following = [];
    this.params = {};
    this.filterChips = [ 
      {label: 'All', selected: true, value: {} },
      {label: 'Popular', value: {popular: true} },
      {label: 'Today',value: {created_d1: new Date( Date.now() - 24*60*60*1000 ), created_d2: new Date() } }
    ]
  }

  ngOnInit(): void {
    if(!this.auth.isExpired){
      this.inat.getRelationships('').then((relationships:Relationship[])=>{
        this.following = relationships;
        this.loadObservations()
      })
    }

    this.sub = this.activatedRoute.queryParams.subscribe((qP)=>{
      let ids = this.following.map((f)=>f.friend_user.id)
      if(this.selected){
        ids = [this.selected.friend_user.id]
      }
      this.params = {user_id: ids}

      Object.keys(qP).forEach((k:string)=>{
        this.params[k] = qP[k];
      })
      if(qP['popular']){
        this.filterChips[0].selected = false;
        this.filterChips[1].selected = true;
      }else if(qP['created_d1']){
        this.filterChips[0].selected = false;
        this.filterChips[2].selected = true;
      }

    })

  }

  select(following:Relationship){
    if(this.selected==following){
      this.selected = undefined;
    }else{
      this.selected = following;
    }
    this.reload();
  }

  reload(){
    this.loadObservations();
  }

  loadObservations(){
    let ids = this.following.map((f)=>f.friend_user.id)
    if(this.selected){
      ids = [this.selected.friend_user.id]
    }
    let newParams = Object.assign({},this.params)
    newParams['user_id'] = ids
    this.params = newParams;
  }

  onSelect(chip:Chip){
    this.router.navigate([],{queryParams: (chip.value as KeyValue)})
  }

}
