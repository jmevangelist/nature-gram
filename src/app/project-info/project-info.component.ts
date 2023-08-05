import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../inaturalist/inaturalist.interface';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [CommonModule,ProjectCardComponent],
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {
  slug!: string;
  project!: Project | undefined;
  inat: InaturalistService;

  constructor(private route: ActivatedRoute){
    this.slug = this.route.snapshot.params['slug'];
    this.inat = inject(InaturalistService);
  }

  ngOnInit(): void {
    this.inat.getProjects([['q',this.slug]]).then((projects:Project[])=>{
      if(projects.length){
        this.project = projects.at(0);
      }
    })
  }
}
