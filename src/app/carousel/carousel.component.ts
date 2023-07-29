import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../inaturalist/inaturalist.interface';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, angleIcon } from '@cds/core/icon';
import { FullscreenCarouselComponent } from '../fullscreen-carousel/fullscreen-carousel.component';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule,ClarityModule,FullscreenCarouselComponent],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() photos!: Photo[]  
  index: number = 0;
  fullscreen: boolean = false;
}
ClarityIcons.addIcons(angleIcon)


