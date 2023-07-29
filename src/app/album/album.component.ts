import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../inaturalist/inaturalist.interface';
import { ClarityModule } from '@clr/angular';
import { FullscreenCarouselComponent } from '../fullscreen-carousel/fullscreen-carousel.component';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule,ClarityModule,FullscreenCarouselComponent],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  @Input() photos!: Photo[];
  fullscreen: boolean = false;
  index: number = 0;

  @ViewChildren('cPhotos') carouselPhotos!: QueryList<any>;

  ngOnInit(): void {
    this.photos.sort((a,b)=>b.original_dimensions.width-a.original_dimensions.width)
  }

  openPhoto(index:number){
    this.fullscreen = true;
    this.index = index;
  }

}
