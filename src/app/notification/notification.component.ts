import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { ResultsUpdates, Notification } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { DateTimeAgoPipe } from '../shared/date-time-ago.pipe';
import { RouterLink } from '@angular/router';


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

  constructor(){
    this.inatServe = inject(InaturalistService);
    this.notifications = [];
  }

  ngOnInit(): void {
    this.inatServe.getObservationsUpdates().then((results:ResultsUpdates)=>{
      this.notifications = results.results;
    })
  }

}
