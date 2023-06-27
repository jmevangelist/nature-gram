import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist';
import { DateTimeAgoPipe } from '../date-time-ago.pipe'

@Component({
  selector: 'app-gram',
  standalone: true,
  imports: [CommonModule,DateTimeAgoPipe],
  templateUrl: './gram.component.html',
  styleUrls: ['./gram.component.css'],
})
export class GramComponent {
  @Input() observation!: Observation;
}
