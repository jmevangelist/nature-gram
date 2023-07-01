import { Component, QueryList, ViewChildren, inject, AfterViewInit, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Observation } from '../inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { InaturalistService } from '../inaturalist.service';
import { ClarityModule } from '@clr/angular';
import { HomeService } from './home.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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
export class HomeComponent implements AfterViewInit {

  observations: Observation[] = [];
  homeService: HomeService = inject(HomeService);
  inaturalistService: InaturalistService = inject(InaturalistService);
  loading: boolean = true;

  private observer: IntersectionObserver | undefined;  
  private initLoad = false;

  @ViewChildren('grams') grams!: QueryList<any>;

  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router){
    this.createObserver()
    let sub = this.router.events.pipe(
      filter((e): e is NavigationStart => e instanceof NavigationStart))
      .subscribe((e)=>{
        if(e.navigationTrigger == 'imperative'){
          this.homeService.prev_scroll = document.querySelector('.content-area')?.scrollTop
        }
        sub.unsubscribe();
      })
  }

  trackByItems(index: number, obs: Observation): number { return obs.id; }

  ngAfterViewInit(){
    this.grams.changes.subscribe(t=>{
      this.ngForRendered(t)
    })
    this.observations = this.homeService.Observations;
    
    if(this.observations.length == 0){
      this.moreObservations()
    }else{
      this.changeDetectorRef.detectChanges();
      document.querySelector('.content-area')?.scrollTo({top: this.homeService.prev_scroll})
    }
  }

  ngForRendered(t:any){
    this.loading = false;
    this.changeDetectorRef.detectChanges();
    let lastElement = document.querySelector('.last');
    if(lastElement){  
      this.observer?.observe(lastElement);
    }
    
  }

  private moreObservations(){
    this.loading = true;
    const params = this.homeService.extraParams();
    this.inaturalistService.getObservations(params)
      .then( (observations:Observation[])=>{
        if(observations){
          this.observations.push(...observations)
        }else{
          this.loading = false;
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
