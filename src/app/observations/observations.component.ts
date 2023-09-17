import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist/inaturalist.interface';
import { SquareGridDirective } from '../shared/square-grid.directive';
import { UrlifyDirective } from '../shared/urlify.directive';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { ClarityModule } from '@clr/angular';
import { GramComponent } from '../gram/gram.component';
import { ObservationMiniComponent } from './observation-mini/observation-mini.component';
import { KeyValue } from '../shared/generic.interface';
import { BehaviorSubject, Observable, filter,of, scan, share, switchMap, tap, withLatestFrom } from 'rxjs';
import { InaturalistAPIService } from '../inaturalist/inaturalist-api.service';

@Component({
  selector: 'app-observations',
  standalone: true,
  imports: [CommonModule,
    SquareGridDirective,
    UrlifyDirective,
    IntersectionObserverDirective,
    ClarityModule,
    GramComponent,
    ObservationMiniComponent
  ],
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.css']
})
export class ObservationsComponent implements OnInit {
  
  @Input() max!: number;
  @Input() styled: boolean;
  @Input() size: 1|2|3;
  @Input() style!: 'cards'|'grid';
  @Input() allowEmptyQuery!: boolean;
  loadingObs!:boolean;
  end!:boolean;
  noObs: boolean;
  @Input() retrieveOnScroll!: boolean;
  obs$: Observable<Observation[]>;
  private inatAPI: InaturalistAPIService;
  private query$: BehaviorSubject<KeyValue|null>;
  nextPage$: BehaviorSubject<number>; 

  constructor(){
    this.inatAPI = inject(InaturalistAPIService);
    this.loadingObs = false;
    this.styled = false;
    this.size = 1;
    this.end = false;
    this.noObs = false;

    this.query$ = new BehaviorSubject<KeyValue|null>(null);
    this.nextPage$ = new BehaviorSubject<number>(1);

    this.obs$ = this.nextPage$.pipe(
      withLatestFrom(
        this.query$.pipe(filter((p):p is KeyValue|null => (this.allowEmptyQuery || Boolean(p))))
      ),
      tap(()=>{ 
        this.loadingObs = true 
      }),
      switchMap(([next,query]) => {
        let params = Object.assign({},query);
        params['page'] = next
        if (next === 0){
          return of([])
        }else{
          return this.inatAPI.getObservations(params)
        }
      }),
      withLatestFrom(this.nextPage$),
      tap(([obs,page])=>{ 
        if(obs.length == 0){ 
          if( page > 1){ 
            this.end = true 
          }else if(page == 1){
            this.noObs = true
          }
        } 

        if(page == 0){
          this.nextPage$.next(1)
        }else{
          this.loadingObs = false
        }
      }),
      scan((acc,[obs,page])=> page === 0 ? obs : [...acc,...obs] ,[] as Observation[]),
      share()
    )

  }

  @Input() set query(query:any){
    this.end = false;
    this.noObs = false;
    this.query$.next(query);
    this.nextPage$.next(0);
  
  }

  ngOnInit(): void {
    
    if(this.style == 'cards' && this.retrieveOnScroll === undefined){
      this.retrieveOnScroll = true;
    }
    if(this.max > 0){
      this.retrieveOnScroll = false;
    }

    if(this.allowEmptyQuery === undefined){
      this.allowEmptyQuery = true;
    }

  }

  trackByItems(index: number, obs: Observation): number { return obs.id; }

  intersected(){
    this.nextPage$.next(this.nextPage$.value+1)
  }

  onObsClick(o:any){
    this.style = 'cards'
    let el = document.getElementById(o.observation.id)
    setTimeout(() => {
      el?.scrollIntoView(true)
    },0)
  }

}
