import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Project } from '../inaturalist/inaturalist.interface';
import { UrlifyDirective } from '../shared/urlify.directive';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule,UrlifyDirective],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements AfterViewInit {
  @Input() project!:Project;
  bgUrl:string;
  @ViewChild('description') description!: ElementRef;

  constructor(private location:Location){
    this.bgUrl = this.location.prepareExternalUrl('/assets/') + 'wave-bg.png';
  }

  ngAfterViewInit(): void {
    let imgs:Element[] = this.description.nativeElement.querySelectorAll('img');
    imgs.forEach((e:Element)=>{
      e.remove()
    })
  }

}
