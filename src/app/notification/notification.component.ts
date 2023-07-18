import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { ResultsUpdates, Notification } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { DateTimeAgoPipe } from '../shared/date-time-ago.pipe';
import { RouterLink } from '@angular/router';
import { NotificationService } from './notification.service';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule,HeaderComponent,DateTimeAgoPipe,RouterLink],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  inatServe: InaturalistService;
  notifications: Notification[];
  notificationService: NotificationService;

  constructor(){
    this.inatServe = inject(InaturalistService);
    this.notificationService = inject(NotificationService);
    this.notifications = [];
  }

  ngOnInit(): void {

    Promise.all([
      this.inatServe.getObservationsUpdates({observations_by:'following'}),
      this.inatServe.getObservationsUpdates({observations_by:'owner'})
    ]).then((results:ResultsUpdates[])=>{
      results.forEach((r)=>{
        this.notifications.push(...r.results);
      })
      this.notifications.sort((a,b)=> Date.parse(b.created_at) - Date.parse(a.created_at) )
      this.notificationService.setLastCheck();
    })
    
  }

}
