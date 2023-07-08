import { Component, EventEmitter, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceService } from './preference.service';
import { Taxon } from '../inaturalist/inaturalist.interface.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observable, SubscriptionLike, debounceTime, from, fromEvent, throttleTime } from 'rxjs';

@Component({
  selector: 'app-preference',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ClarityModule],
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnDestroy {

  taxa: Taxon[];
  prefService: PreferenceService;
  prefForm: FormGroup;
  taxa_search: Taxon[];
  inatService: InaturalistService;
  sub: SubscriptionLike;

  constructor(){
    this.prefService = inject(PreferenceService);    
    this.inatService = inject(InaturalistService);
    this.taxa = this.prefService.taxa;
    this.prefForm = new FormGroup({
      taxon: new FormControl(''),
      place: new FormControl('')
    })
    this.taxa_search = [];
    this.sub = from(this.prefForm.controls['taxon'].valueChanges).pipe(
        debounceTime(300)
      ).subscribe(this.searchTaxa.bind(this))

  }

  removeTaxa(taxon:Taxon){
    let i = this.taxa.findIndex(t=> t.id == taxon.id)
    this.taxa.splice(i,1)
  }

  searchTaxa(q:string){
    let sel = this.taxa_search.filter((t)=> t.matched_term == q)
    if(sel.length){
      console.log('selected from input',q)
      this.onSubmit(sel.pop())
    }else if (q){
      this.inatService.taxaAutoComplete(q).then((res:Taxon[])=>{
        this.taxa_search = res
        if(res.length == 0){
          this.prefForm.controls['taxon'].setErrors({'invalid':'No matching taxon'})
        }
      }).catch((e)=>{
        this.taxa_search = []
        this.prefForm.controls['taxon'].setErrors({'invalid':e})
      })
    }
  }

  onSubmit(taxon?:Taxon){
    let selected = taxon;

    if(!selected){
      selected = this.taxa_search[0]
    }

    if(this.taxa.filter((t)=> t.id === selected?.id ).length === 0){
      this.taxa.push(selected)
    }

    this.taxa_search = [];
    this.prefForm.controls['taxon'].reset();
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    console.log(this.taxa)
    this.prefService.updateTaxa(this.taxa)
  }

}
