import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation } from '../inaturalist/inaturalist.interface';
import { SquareGridDirective } from '../shared/square-grid.directive';
import { UrlifyDirective } from '../shared/urlify.directive';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { ClarityModule } from '@clr/angular';
import { GramComponent } from '../gram/gram.component';

@Component({
  selector: 'app-observations',
  standalone: true,
  imports: [CommonModule,
    SquareGridDirective,
    UrlifyDirective,
    IntersectionObserverDirective,
    ClarityModule,
    GramComponent
  ],
  templateUrl: './observations.component.html',
  styleUrls: ['./observations.component.css']
})
export class ObservationsComponent implements OnInit {
  
  private inat: InaturalistService;
  @Input() max!: number;
  @Input() styled: boolean;
  @Input() size: 1|2|3;
  @Input() style!: 'cards'|'grid';
  private params!: any;
  loadingObs!:boolean;
  end!:boolean;
  observations!: Observation[];
  @Input() retrieveOnScroll!: boolean;
  private _init:boolean;

  constructor(){
    this.inat = inject(InaturalistService);
    this.observations = [];
    this.loadingObs = false;
    this._init = false;
    this.styled = false;
    this.size = 1;
    this.end = false;
  }

  @Input() set query(query:any){
    console.log(query)
    this.params = {
      page: 1
    }
    Object.keys(query).forEach(k=>{
      this.params[k] = query[k];
    })
    if(this._init){
      this.observations = [];
      this.retrieveObs();
    }
  }

  ngOnInit(): void {

    this._init = true;
    if(this.style == 'cards' && this.retrieveOnScroll === undefined){
      this.retrieveOnScroll = true;
    }
    if(this.max > 0){
      this.retrieveOnScroll = false;
    }

    if(this.retrieveOnScroll){
      delete this.params['per_page'];
      this.params['page'] = 1;
    }else{
      this.params['per_page'] = this.max;
    }
    this.observations = [];
    this.retrieveObs();

  }

  trackByItems(index: number, obs: Observation): number { return obs.id; }

  intersected(){
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
      }else if(obs.length == 0){
        this.end = true;
      }
    }).finally(()=>{
      this.loadingObs = false;
    })
  }

}
