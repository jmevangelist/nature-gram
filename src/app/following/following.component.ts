import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Relationship } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { GramComponent } from '../gram/gram.component';
import { AuthorizationService } from '../authorization/authorization.service';
import { BehaviorSubject, Observable, Subject, SubscriptionLike, combineLatest, map, share } from 'rxjs';
import { UrlifyDirective } from '../shared/urlify.directive';
import { ObservationsComponent } from '../observations/observations.component';
import { KeyValue } from '../shared/generic.interface';
import { Chip } from '../chips/chip.interface';
import { ChipsComponent } from '../chips/chips.component';
import { ActivatedRoute, Router } from '@angular/router';
import { InaturalistAPIService } from '../inaturalist/inaturalist-api.service';

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
export class FollowingComponent {

  auth: AuthorizationService;
  params: KeyValue;
  filterChips: Chip[];
  q$!: Observable<KeyValue>;
  selectedUser$!: BehaviorSubject<number|undefined>;
  relationships$: Observable<Relationship[]>;
  filterSelect$: Observable<string|null>;
  private inatAPI: InaturalistAPIService;

  constructor(private router:Router,private activatedRoute:ActivatedRoute){
    this.auth = inject(AuthorizationService);
    this.params = {};
    this.filterChips = [ 
      {label: 'All', selected: true, value: {} },
      {label: 'Popular', value: {popular: true} },
      {label: 'Today',value: {created_d1: new Date( Date.now() - 24*60*60*1000 ), created_d2: new Date() } }
    ]
    this.inatAPI = inject(InaturalistAPIService);
    this.relationships$ = this.inatAPI.getRelationships('').pipe(share())
    this.selectedUser$ = new BehaviorSubject<number|undefined>(undefined)

    this.q$ = combineLatest([
      this.relationships$.pipe(map((rel)=>{
        return rel.map((r)=> r.friend_user.id )
      })),
      this.selectedUser$,
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParams
    ]).pipe(
      map(pArr => {
        let params:any = {};

        if(pArr[1]){
          params['user_id'] = pArr[1]
        }else{
          params['user_id'] = pArr[0]
        }

        if(pArr[2]){
          pArr[2].keys.forEach((k:string)=>{
            if(k=='filter'){
              if(pArr[2].get(k) === 'popular'){
                Object.assign(params,this.filterChips[1].value)
              }else if(pArr[2].get(k) === 'today'){
                Object.assign(params,this.filterChips[2].value)
              }
            }
          })
        }

        if(pArr[3]){
          Object.assign(params,pArr[3])
        }
        return params
      })
    )

    this.filterSelect$ = this.activatedRoute.paramMap.pipe(
        map((paramMap)=>{
          return paramMap.get('filter')
        })
      )
  }

  select(following:Relationship){
    if(this.selectedUser$.value === following.friend_user.id){
      this.selectedUser$.next(undefined)
    }else{
      this.selectedUser$.next(following.friend_user.id)
    }

  }

  onSelect(chip:Chip){
    if(chip.label == 'All'){
      this.router.navigate(['/following'])
    }else{
      this.router.navigate(['/following',chip.label.toLocaleLowerCase()])
    }
  }

}
