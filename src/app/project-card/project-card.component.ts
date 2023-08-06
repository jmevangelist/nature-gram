import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../inaturalist/inaturalist.interface';
import { UrlifyDirective } from '../shared/urlify.directive';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule,UrlifyDirective],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent {
  @Input() project!:Project;

}
