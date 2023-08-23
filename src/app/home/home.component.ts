import { Component, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist/inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { ClarityModule } from '@clr/angular';
import { HomeService } from './home.service';
import { Navigation, Router, RouterLink } from '@angular/router';
import { Observable, SubscriptionLike } from 'rxjs';
import { ClarityIcons, filterGridIcon, bellIcon } from '@cds/core/icon';
import { HeaderComponent } from '../header/header.component';
import { ChipsComponent } from '../chips/chips.component';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { NotificationService } from '../notification/notification.service';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';

@Component({
  selector: 'app-home',
  standalone: true, 
  imports: [
    CommonModule,
    GramComponent,
    ClarityModule,
    RouterLink,
    HeaderComponent,
    ChipsComponent,
    IntersectionObserverDirective
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  observations: Observable<Observation[]>;
  homeService: HomeService = inject(HomeService);
  notificationService: NotificationService = inject(NotificationService);
  loading: Observable<boolean>;
  end: boolean;

  bellIcon: IconShapeTuple;
  notification$: Observable<number>;
  chipGroup: any[];

  // private currentNavigation: Navigation | null;
  private sub?: SubscriptionLike;

  constructor(private router: Router, private view: ViewContainerRef){
    ClarityIcons.addIcons(filterGridIcon)
    this.observations = this.homeService.observations$;
    this.loading = this.homeService.loading$;
    // this.currentNavigation = this.router.getCurrentNavigation();
    this.end = false;

    this.bellIcon = bellIcon;
    this.notification$ = this.notificationService.notification$;
    this.chipGroup = this.homeService.chipGroup;

  }

  ngOnInit(): void {
    this.homeService.refresh();
    this.moreObservations();
  }

  ngOnDestroy(): void {
    console.log('destroy home')
    this.sub?.unsubscribe();
    this.homeService.saveDefaultFilter();
  }

  trackByItems(index: number, obs: Observation): number { return obs.id; }

  private moreObservations(){
    this.end = false;
    this.homeService.loadObservations().then((b)=>{
      this.end = !b;
    })
  }

  reload(){
    document.querySelector('.home')?.scrollIntoView(true)
    this.end = false;
    this.homeService.reload().then((b)=>{
      this.end = !b;
    });
  }

  selectChip(cG?:any){
    this.homeService.updateParams(cG)
    this.homeService.reload().then((b)=>{
      this.end = !b;
    })
  }

  goToNotifications(){
    this.router.navigateByUrl('/notifications')
  }

  intersected(){
    this.moreObservations();
  }

}