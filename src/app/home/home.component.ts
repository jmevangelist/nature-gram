import { Component, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GramComponent } from '../gram/gram.component';
import { ClarityModule } from '@clr/angular';
import { HomeService } from './home.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ClarityIcons, filterGridIcon, bellIcon } from '@cds/core/icon';
import { HeaderComponent } from '../header/header.component';
import { ChipsComponent } from '../chips/chips.component';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';
import { NotificationService } from '../notification/notification.service';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { ObservationsComponent } from '../observations/observations.component';
import { KeyValue } from '../shared/generic.interface';

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
    IntersectionObserverDirective,
    ObservationsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  homeService: HomeService = inject(HomeService);
  notificationService: NotificationService = inject(NotificationService);
  q$!: Observable<KeyValue>;

  bellIcon: IconShapeTuple;
  notification$: Observable<number>;
  chipGroup: any[];

  constructor(private router: Router, private view: ViewContainerRef, private activatedRoute:ActivatedRoute){
    ClarityIcons.addIcons(filterGridIcon)

    this.bellIcon = bellIcon;
    this.notification$ = this.notificationService.notification$;
    this.chipGroup = this.homeService.chipGroup;

    this.q$ = this.activatedRoute.queryParams;

  }

  ngOnInit(): void {
    this.homeService.refresh();
    let params:KeyValue = this.homeService.getCurrentParams();
    this.router.navigate(['/home'], { queryParams: params });
  }

  ngOnDestroy(): void {
    this.homeService.saveDefaultFilter();
  }


  reload(){
    //todo
  }

  selectChip(cG?:any):void{
    this.homeService.updateParams(cG);
    let params:KeyValue = this.homeService.getCurrentParams();
    this.router.navigate(['/home'], { queryParams: params });
  }

  goToNotifications(){
    this.router.navigateByUrl('/notifications')
  }


}