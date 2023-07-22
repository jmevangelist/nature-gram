import { Component, QueryList, ViewChildren, inject, AfterViewInit, ChangeDetectorRef, OnDestroy, ElementRef, ViewChild, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist/inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { ClarityModule } from '@clr/angular';
import { HomeService } from './home.service';
import { Navigation, Router, RouterLink } from '@angular/router';
import { Observable, SubscriptionLike } from 'rxjs';
import { ClarityIcons, angleIcon, filterGridIcon, bellIcon, bellIconName } from '@cds/core/icon';
import { HeaderComponent } from '../header/header.component';
import { ChipsComponent } from '../chips/chips.component';
import { Chip } from '../chips/chip.interface';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { NotificationService } from '../notification/notification.service';

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
  notificationService: NotificationService = inject(NotificationService);
  loading: Observable<boolean>;
  end: boolean;

  filterChips: Chip[];
  bellIcon: IconShapeTuple;
  notification$: Observable<number>;
  chipGroup: any[];

  private observer: IntersectionObserver | undefined;  
  private currentNavigation: Navigation | null;
  private sub?: SubscriptionLike;

  @ViewChildren('grams') grams!: QueryList<any>;

  constructor(private router: Router, private view: ViewContainerRef){
    this.observations = this.homeService.observations$;
    this.loading = this.homeService.loading$;
    this.currentNavigation = this.router.getCurrentNavigation();
    this.createObserver()
    this.end = false;

    this.filterChips = this.homeService.filterChips;
    this.bellIcon = bellIcon;
    this.notification$ = this.notificationService.notification$;
    this.chipGroup = this.homeService.chipGroup;

  }

  ngOnInit(): void {
    if(this.currentNavigation?.trigger == 'imperative'){
      this.homeService.refresh();
      this.moreObservations();
    }else if(this.currentNavigation?.trigger == 'popstate'){
      if(this.homeService.getObservations().length == 0){
        if(!this.homeService.busy.value){
          this.moreObservations();
        }
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
    this.homeService.saveDefaultFilter();
  }

  trackByItems(index: number, obs: Observation): number { return obs.id; }

  private moreObservations(){
    console.log('more')
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
    document.querySelector('.home')?.scrollIntoView(true)
    this.end = false;
    this.homeService.reload().then((b)=>{
      this.end = !b;
    });
  }

  selectChip(chips?:any){
    this.homeService.updateParams(chips)
    this.homeService.reload().then((b)=>{
      this.end = !b;
    })
  }

  goToNotifications(){
    this.router.navigateByUrl('/notifications')
  }

}


ClarityIcons.addIcons(filterGridIcon)