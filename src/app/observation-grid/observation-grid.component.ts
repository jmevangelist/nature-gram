import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation } from '../inaturalist/inaturalist.interface';
import { SquareGridDirective } from '../shared/square-grid.directive';
import { UrlifyDirective } from '../shared/urlify.directive';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { ClarityModule } from '@clr/angular';
import { toStringHDMS } from 'ol/coordinate';

@Component({
  selector: 'app-observation-grid',
  standalone: true,
  imports: [CommonModule,
    SquareGridDirective,
    UrlifyDirective,
    IntersectionObserverDirective,
    ClarityModule],
  templateUrl: './observation-grid.component.html',
  styleUrls: ['./observation-grid.component.css']
})
export class ObservationGridComponent implements OnInit {
  
  private inat: InaturalistService;
  @Input() max: number;
  @Input() styled: boolean;
  private params!: any;
  loadingObs!:boolean;
  observe:boolean;
  observations!: Observation[];
  @Input() retrieveOnScroll!: boolean;
  private _init:boolean;
  private _query:any;

  constructor(){
    this.inat = inject(InaturalistService);
    this.max = 18;
    this.observations = [];
    this.retrieveOnScroll = false;
    this.loadingObs = false;
    this.observe = false;
    this._init = false;
    this.styled = false;
  }

  @Input() set query(query:any){
    this.params = {
      page: 1
    }
    this._query = query;
    Object.keys(query).forEach(k=>{
      this.params[k] = query[k];
    })
    if(this._init){
      this.observe = false;
      this.observations = [];
      this.retrieveObs();
    }
  }

  ngOnInit(): void {

    this._init = true;
    if(this.retrieveOnScroll){
      delete this.params['per_page'];
      this.params['page'] = 1;
    }else{
      this.params['per_page'] = this.max;
    }
    this.observations = [];
    this.retrieveObs();
  }

  intersected(){
    this.observe = false;
    this.retrieveObs();
  }

  retrieveObs(){
    let paramsArray:string[][] = [];
    Object.keys(this.params).forEach(k=>{
      if(this.params[k]){
        paramsArray.push(...[[k,this.params[k].toString()]])
      }
    })
    this.loadingObs = true;
    this.inat.getObservations(paramsArray).then(obs=>{
      this.observations.push(...obs);
      if(this.retrieveOnScroll && obs.length){
        this.params.page++;
        this.observe = true;
      }
    }).finally(()=>{
      this.loadingObs = false;
    })
  }

}
