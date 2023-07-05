import { Component, QueryList, ViewChildren, inject, AfterViewInit, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { InaturalistService } from '../inaturalist.service';
import { ClarityModule } from '@clr/angular';
import { HomeService } from './home.service';
import { Navigation, Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GramComponent,
    ClarityModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {

  observations: Observation[] = [];
  homeService: HomeService = inject(HomeService);
  inaturalistService: InaturalistService = inject(InaturalistService);
  loading: boolean = true;

  private observer: IntersectionObserver | undefined;  
  private currentNavigation: Navigation | null;
  private sub?: SubscriptionLike;

  @ViewChildren('grams') grams!: QueryList<any>;

  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router){
    this.observations = this.homeService.Observations;
    this.currentNavigation = this.router.getCurrentNavigation();
    this.createObserver()
  }

  ngOnInit(): void {
    if(this.currentNavigation?.trigger == 'imperative'){
      this.homeService.refresh();
      this.moreObservations();
    }
  }

  ngAfterViewInit(){
    let lastElement = document.querySelector('.last');
    if(lastElement){  
      this.observer?.observe(lastElement);
    }

    this.sub = this.grams.changes.subscribe(this.ngForRendered.bind(this))
  }

  ngForRendered(t:any){
    this.loading = false;
    this.changeDetectorRef.detectChanges();
    let lastElement = document.querySelector('.last');
    if(lastElement){  
      this.observer?.observe(lastElement);
    }
    
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.observer?.disconnect();
  }

  trackByItems(index: number, obs: Observation): number { return obs.id; }

  private moreObservations(){
    this.loading = true;
    const params = this.homeService.extraParams();
    this.inaturalistService.getObservations(params)
      .then( (observations:Observation[])=>{
        if(observations.length){
          let newObs = observations.filter(o => this.observations.findIndex( ob => ob.id == o.id) == -1 )
          if(newObs.length){
            this.observations.push(...newObs)
          }else{
            this.moreObservations();
          }
        }else{
          this.loading = false;
          this.homeService.pushBackDateRange()
          this.moreObservations()
        }
      }).catch(e => {
        console.log(e)
        this.loading = false;
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
          this.moreObservations()
          observer.unobserve(entry.target)
        }
      })
    },options)
  }

}
