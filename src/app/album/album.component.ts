import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../inaturalist/inaturalist.interface';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule,ClarityModule],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  @Input() photos!: Photo[];
  fullscreen: boolean = false;
  index: number = 0;

  @ViewChild('fullscreenTemplate',{read: ViewContainerRef}) fullscreenTemplate!: ViewContainerRef;
  @ViewChildren('cPhotos') carouselPhotos!: QueryList<any>;

  ngOnInit(): void {
  }

  openPhoto(index:number){
    this.fullscreen = true;
    this.index = index;
    this.openfullscreen();
  }

  async openfullscreen(){
    if(this.fullscreenTemplate){
      this.fullscreenTemplate.clear();
      const { FullscreenCarouselComponent } = await import('../fullscreen-carousel/fullscreen-carousel.component');
      let fullscreenComponent = this.fullscreenTemplate.createComponent(FullscreenCarouselComponent);
      fullscreenComponent.instance.photos = this.photos;
      fullscreenComponent.instance.index = this.index;
      fullscreenComponent.instance.close.subscribe(()=>{this.fullscreenTemplate.clear()})     
    }
  }


}
