import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../inaturalist/inaturalist.interface'
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule,ClarityModule],
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.css']
})
export class PlaceCardComponent {
  @Input() place!: Place;
}
