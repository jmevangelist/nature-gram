import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../inaturalist/inaturalist.interface';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-fullscreen-carousel',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: './fullscreen-carousel.component.html',
  styleUrls: ['./fullscreen-carousel.component.css']
})
export class FullscreenCarouselComponent implements OnInit, AfterViewInit {
  @Input() photos!: Photo[];
  @Input() index: number;
  @Output() close: EventEmitter<void>;

  @ViewChildren('cPhotos') carouselPhotos!: QueryList<any>;

  constructor(){
    this.index = 0;
    this.close = new EventEmitter<void>;
  }

  ngOnInit(): void {
    this.photos.sort((a,b)=>b.original_dimensions.width-a.original_dimensions.width)
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let cP = this.carouselPhotos.get(this.index);
      cP.nativeElement.scrollIntoView();
    })
  }

  left(){
    this.index--
    let cP = this.carouselPhotos.get(this.index);
    cP.nativeElement.scrollIntoView();
  }

  right(){
    this.index++
    let cP = this.carouselPhotos.get(this.index);
    cP.nativeElement.scrollIntoView();
  }
}
