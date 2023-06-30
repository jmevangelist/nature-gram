import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InaturalistService } from '../inaturalist.service';
import { Observation } from '../inaturalist.interface';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  user_login: string = ''
  inaturalistService: InaturalistService = inject(InaturalistService)
  observations: Observation[] = []

  constructor(){
    this.user_login = this.route.snapshot.params['user_login'];
    this.inaturalistService.getObservations([['user_login',this.user_login]])
    .then( (observations:Observation[]) => {
      this.observations = observations;
    })
  }

}
