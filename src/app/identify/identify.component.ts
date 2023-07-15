import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation, Taxon } from '../inaturalist/inaturalist.interface';
import { CarouselComponent } from '../carousel/carousel.component';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-identify',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.css']
})
export class IdentifyComponent {
  @Input() observation!: Observation;
  @Output() taxonIdentification!: EventEmitter<Taxon>;

  private inatServ: InaturalistService;
  suggestions: any[];
  qTaxon: FormControl;

  constructor(){
    this.taxonIdentification = new EventEmitter<Taxon>();
    this.inatServ = inject(InaturalistService);
    this.suggestions = []
    this.qTaxon = new FormControl('');
  }

  getSuggestions(){
    this.inatServ.getComputerVisionOnObs(this.observation.uuid).then( (suggestions:any[]) => {
      console.log(suggestions)
      this.suggestions = suggestions;
    }) 
  }

}
