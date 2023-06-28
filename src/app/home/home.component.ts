import { Component, QueryList, ViewChildren, inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation } from '../inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { InaturalistService } from '../inaturalist.service';
import { ClarityModule } from '@clr/angular';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GramComponent,
    ClarityModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  observations: Observation[] = [];
  inaturalistService: InaturalistService = inject(InaturalistService);
  loading: boolean = false;

  private observer: IntersectionObserver | undefined;  
  private extraParams: string[][] | undefined = undefined;

  @ViewChildren('grams') grams!: QueryList<any>;

  constructor(private changeDetectorRef: ChangeDetectorRef){
    this.createObserver()
    this.moreObservations()
  }

  trackByItems(index: number, obs: Observation): number { return obs.id; }

  ngAfterViewInit(){
    this.grams.changes.subscribe(t=>{
      this.ngForRendered(t)
    })
  }

  ngForRendered(t:any){
    this.loading = false;
    this.changeDetectorRef.detectChanges();
    let lastId = t.last.observation.id.toString();
    this.extraParams = [['id_below', lastId]]
    let lastElement = document.querySelector('.last');
    if(lastElement){
      this.observer?.observe(lastElement);
    }
    
  }

  private moreObservations(){
    this.loading = true;
    this.inaturalistService.getObservations(this.extraParams)
      .then( (observations:Observation[])=>{
        console.log(this.inaturalistService.counter)
        this.observations.push(...observations)
      })
  }

  private createObserver(){
    const options = {
      rootMargin: '0px',
      threshold: 0.25
    }
    
    this.observer = new IntersectionObserver((entries,observer)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          this.moreObservations()
          observer.unobserve(entry.target)
        }
      })
    },options)

  }

}
