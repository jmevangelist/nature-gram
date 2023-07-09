import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceService } from './preference.service';
import { Place, Taxon } from '../inaturalist/inaturalist.interface.js';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { SubscriptionLike, debounceTime, from } from 'rxjs';

@Component({
  selector: 'app-preference',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ClarityModule],
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.css']
})
export class PreferenceComponent implements OnDestroy {

  taxa: Taxon[];
  places: Place[];
  prefService: PreferenceService;
  prefForm: FormGroup;
  taxa_search: Taxon[];
  inatService: InaturalistService;
  sub: SubscriptionLike[] = [];
  isSearchingTaxa: boolean;
  isSearchingPlace: boolean;
  place_search: Place[];

  constructor(){
    this.prefService = inject(PreferenceService);    
    this.inatService = inject(InaturalistService);
    this.taxa = this.prefService.taxa;
    this.places = this.prefService.places;
    this.prefForm = new FormGroup({
      taxon: new FormControl(''),
      place: new FormControl('')
    })
    this.taxa_search = [];
    this.place_search = [];
    this.isSearchingTaxa = false;
    this.isSearchingPlace = false;
    this.sub.push(from(this.prefForm.controls['taxon'].valueChanges).pipe(
        debounceTime(300)
      ).subscribe(this.searchTaxa.bind(this)))
    this.sub.push(from(this.prefForm.controls['place'].valueChanges).pipe(
      debounceTime(300)
    ).subscribe(this.searchPlaces.bind(this)))

  }

  removeTaxa(taxon:Taxon){
    let i = this.taxa.findIndex(t=> t.id == taxon.id)
    this.taxa.splice(i,1)
  }

  searchTaxa(q:string){
    if(q){
      this.isSearchingTaxa = true;
      this.inatService.taxaAutoComplete(q).then((res:Taxon[])=>{
        this.taxa_search = res
        if(res.length == 0){
          this.prefForm.controls['taxon'].setErrors({'invalid':'No matching taxon'})
        }
      }).catch((e)=>{
        this.taxa_search = []
        this.prefForm.controls['taxon'].setErrors({'invalid':e})
      }).finally(()=>{
        this.isSearchingTaxa = false;
      })
    }else{
      this.taxa_search = []
    }
  }

  searchPlaces(q:string){
    if(q){
      this.isSearchingPlace = true;
      this.inatService.searchPlaces(q).then((res:Place[])=>{
        this.place_search = res
        if(res.length == 0){
          this.prefForm.controls['place'].setErrors({'invalid':'No matching place'})
        }
      }).catch((e)=>{
        this.place_search = []
        this.prefForm.controls['place'].setErrors({'invalid':e})
      }).finally(()=>{
        this.isSearchingPlace = false;
      })
    }else{
      this.place_search = []
    }
  }


  selectTaxon(taxon:Taxon):void{
    let selected = taxon;

    if(this.taxa.filter((t)=> t.id === selected?.id ).length === 0){
      this.taxa.push(selected)
    }

    this.taxa_search = [];
    this.prefForm.controls['taxon'].reset();
  }

  selectPlace(place:Place):void{
    let selected = place;

    if(this.places.filter((t)=> t.id === selected?.id ).length === 0){
      this.places.push(selected)
    }

    this.place_search = [];
    this.prefForm.controls['place'].reset();
  }

  removePlace(place:Place){
    let i = this.places.findIndex(t=> t.id == place.id)
    this.places.splice(i,1)
  }

  onSubmit(){    
    console.log(this.prefForm.value)
    
    if(this.taxa_search.length > 0){
      this.selectTaxon(this.taxa_search[0])
    }
    if(this.place_search.length > 0){
      this.selectPlace(this.place_search[0])
    }
  }

  ngOnDestroy(){
    this.sub.forEach((s) => { s.unsubscribe})
    console.log(this.taxa)
    this.prefService.updateTaxa(this.taxa)
    this.prefService.updatePlace(this.places)
  }

}
