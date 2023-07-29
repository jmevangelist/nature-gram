import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../inaturalist/inaturalist.interface';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, angleIcon } from '@cds/core/icon';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule,ClarityModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() photos!: Photo[]  
  private index: number;
  @Input() disableFullScreen: boolean;

  @ViewChild('fullscreenTemplate',{read: ViewContainerRef}) fullscreenTemplate!: ViewContainerRef;

  constructor(){
    this.disableFullScreen = false;
    this.index = 0
  }

  async openfullscreen(index:number){
    if(this.fullscreenTemplate && !this.disableFullScreen){
      this.fullscreenTemplate.clear();
      const { FullscreenCarouselComponent } = await import('../fullscreen-carousel/fullscreen-carousel.component');
      let fullscreenComponent = this.fullscreenTemplate.createComponent(FullscreenCarouselComponent);
      fullscreenComponent.instance.photos = this.photos;
      fullscreenComponent.instance.index = index;
      fullscreenComponent.instance.close.subscribe(()=>{this.fullscreenTemplate.clear()})     
    }
  }

}
ClarityIcons.addIcons(angleIcon)


