import { Component, QueryList, ViewChildren, inject, AfterViewInit, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist/inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { ClarityModule } from '@clr/angular';
import { HomeService } from './home.service';
import { Navigation, Router } from '@angular/router';
import { Observable, SubscriptionLike } from 'rxjs';

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

  observations: Observable<Observation[]>; //= [];
  homeService: HomeService = inject(HomeService);
  loading: Observable<boolean>;
  end: boolean;

  private observer: IntersectionObserver | undefined;  
  private currentNavigation: Navigation | null;
  private sub?: SubscriptionLike;

  @ViewChildren('grams') grams!: QueryList<any>;

  constructor(private router: Router){
    this.observations = this.homeService.observations$;
    this.loading = this.homeService.loading$;
    this.currentNavigation = this.router.getCurrentNavigation();
    this.createObserver()
    this.end = false;
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
    this.homeService.loadObservations().then((b)=>{
      this.end = !b;
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
