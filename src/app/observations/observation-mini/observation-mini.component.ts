import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation, Photo } from 'src/app/inaturalist/inaturalist.interface';

@Component({
  selector: 'app-observation-mini',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observation-mini.component.html',
  styleUrls: ['./observation-mini.component.css']
})
export class ObservationMiniComponent implements OnInit {
  @Input() observation!: Observation;
  photo!: Photo;

  constructor(){
  }

  ngOnInit(): void {
    if(this.observation.photos.length){
      let index = Math.floor(Math.random()*this.observation.photos.length);
      this.photo = this.observation.photos[index]
    }
  }
}
