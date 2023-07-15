import { Component, QueryList, ViewChildren, inject, AfterViewInit, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist/inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { ClarityModule } from '@clr/angular';
import { HomeService } from './home.service';
import { Navigation, Router, RouterLink } from '@angular/router';
import { Observable, SubscriptionLike } from 'rxjs';
import { ClarityIcons, angleIcon, filterGridIcon } from '@cds/core/icon';
import { HeaderComponent } from '../header/header.component';
import { ChipsComponent } from '../chips/chips.component';
import { Chip } from '../chips/chip.interface';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [
    CommonModule,
    GramComponent,
    ClarityModule,
    RouterLink,
    HeaderComponent,
    ChipsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {

  observations: Observable<Observation[]>;
  homeService: HomeService = inject(HomeService);
  loading: Observable<boolean>;
  end: boolean;

  filterChips: Chip[];

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

    this.filterChips = this.homeService.filterChips;

  }

  ngOnInit(): void {
    if(this.currentNavigation?.trigger == 'imperative'){
      this.homeService.refresh();
      this.moreObservations();
    }else if(this.currentNavigation?.trigger == 'popstate'){
      if(this.homeService.getObservations().length == 0){
        this.moreObservations();
      }
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
    this.end = false;
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

  reload(){
    this.end = false;
    this.homeService.reload().then((b)=>{
      this.end = !b;
    })
  }

  selectFilterOption(o?:Chip){
    this.homeService.refresh()
    switch (o?.label) {
      case 'New':
        this.homeService.updateParams('order_by','created_at');
        break;
      case 'Popular':
        this.homeService.updateParams('order_by','votes');
        this.homeService.updateParams('popular',true);
        break;
      case 'Recently Updated':
        this.homeService.updateParams('order_by','updated_at');
        break;
      case 'Today':
        this.homeService.updateParams('order_by','created_at');
        let d1 = new Date( Date.parse(Date()) - 24*60*60*1000 )
        this.homeService.updateParams('created_d1',d1);
        this.homeService.updateParams('created_d2',Date())
        break;
      case 'Random':
        this.homeService.updateParams('order_by','random');
        break;
      case 'Unknown':
        this.homeService.updateParams('order_by','created_at');
        this.homeService.updateParams('iconic_taxa','unknown')
    }

    if(o?.option){
      this.homeService.updateParams('created_d2',Date())
      let d2 = Date.now()
      switch (o.option){
        case 'Today':
          this.homeService.updateParams('created_d1',new Date( d2 - 24*60*60*1000 ));
          break;
        case 'Past week':
          this.homeService.updateParams('created_d1',new Date( d2 - 7*24*60*60*1000 ));
          break;
        case 'Past month':
          this.homeService.updateParams('created_d1',new Date( d2 - 30*24*60*60*1000 ));
          break;
        case 'Past year':
          this.homeService.updateParams('created_d1',new Date( d2 - 365*24*60*60*1000))
          break;
      }
    }

    this.moreObservations()
  }

}


ClarityIcons.addIcons(filterGridIcon)