import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { User, TaxonomyNode } from '../inaturalist/inaturalist.interface';
import { ClarityModule, ClrLoadingButton, ClrLoadingState } from '@clr/angular'
import { HeaderComponent } from '../header/header.component';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { UrlifyDirective } from '../shared/urlify.directive';
import { SquareGridDirective } from '../shared/square-grid.directive';
import { ClarityIcons, refreshIcon } from '@cds/core/icon';
import { SubscriptionLike } from 'rxjs';
import { ObservationGridComponent } from '../observation-grid/observation-grid.component';
import { TaxonomyComponent } from '../taxonomy/taxonomy.component';
import { KeyValue } from '../shared/generic.interface';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    HeaderComponent,
    RouterLink,
    IntersectionObserverDirective,
    UrlifyDirective,
    SquareGridDirective,
    ObservationGridComponent,
    TaxonomyComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  route: ActivatedRoute = inject(ActivatedRoute);
  inaturalistService: InaturalistService = inject(InaturalistService)

  user_login: string = ''
  user: User|undefined = undefined;
  following: boolean;
  relationshipID!: number | undefined;
  obsQuery: KeyValue;
  tailId: number;
  private sub!: SubscriptionLike;

  constructor(private router:Router, private activatedRoute:ActivatedRoute){
    this.user_login = this.route.snapshot.params['user_login'];
    this.following = false;
    this.obsQuery = {
      user_login: this.user_login
    }
    this.tailId = 0;
  }

  ngOnInit(): void {
    
    this.inaturalistService.getUserByLogin(this.user_login)
    .then( (user:User | undefined) => {
      this.user = user
    })

    this.inaturalistService.getRelationships(this.user_login).then((r:any)=>{
      if(r.length){
        if(r[0].following){
          this.following = true;
          this.relationshipID = r[0].id;
        }
      }
    }).catch((e)=>{
      console.log(e)
    })

    this.sub = this.activatedRoute.queryParams.subscribe((qP)=>{
      this.obsQuery = {
        user_login: this.user_login
      }

      Object.keys(qP).forEach((k:string)=>{
        this.obsQuery[k] = qP[k];
      })

      if(this.obsQuery['taxon_id']){
        this.tailId = Number(this.obsQuery['taxon_id']);
      }else if(this.obsQuery['identified'] === 'false'){
        this.tailId = -1;
      }else{
        this.tailId = 0;
      }

    })

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
          this.following = true;
          this.relationshipID = res[0].id;
        }).finally(()=>{
          button.loadingStateChange(ClrLoadingState.DEFAULT)
        })
      
    }
  }

}
