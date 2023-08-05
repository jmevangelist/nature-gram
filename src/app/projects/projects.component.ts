import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProjectCardComponent,
    IntersectionObserverDirective,
    RouterOutlet
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  title!: string;

  constructor(){
    this.title = 'Projects'
  }

}
