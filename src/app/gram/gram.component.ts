import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist.interface';
import { DateTimeAgoPipe } from '../date-time-ago.pipe'
import { CarouselComponent } from '../carousel/carousel.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gram',
  standalone: true,
  imports: [
    CommonModule,
    DateTimeAgoPipe,
    CarouselComponent,
    RouterLink, 
    RouterOutlet,
  ],
  templateUrl: './gram.component.html',
  styleUrls: ['./gram.component.css'],
})
export class GramComponent {
  @Input() observation!: Observation;
}
