import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
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
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let cP = this.carouselPhotos.get(this.index);
      cP.nativeElement.scrollIntoView();
    })
  }

  left(){
    if(this.index > 0){
      this.index--
      let cP = this.carouselPhotos.get(this.index);
      cP.nativeElement.scrollIntoView();
    }
  }

  right(){
    if(this.index < this.photos.length-1){
      this.index++
      let cP = this.carouselPhotos.get(this.index);
      cP.nativeElement.scrollIntoView();
    }
  }

  @HostListener('document:keydown',['$event'])
  key(e:KeyboardEvent){
    if(e.key=='ArrowLeft'){
      this.left()
    }else if(e.key=='ArrowRight'){
      this.right()
    }else if(e.key=='Escape'){
      this.close.emit();
    }
    e.stopPropagation();
  }
}
