import { Injectable } from '@angular/core';
import { Place, Taxon } from '../inaturalist/inaturalist.interface';
import { find } from 'rxjs';
import { FiltersProvider } from '@clr/angular/data/datagrid/providers/filters';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  taxa: Taxon[];
  places: Place[];
  options: string[];

  constructor() {
    this.taxa = [];
    let local_storage_taxa = localStorage.getItem('taxa');
    if(local_storage_taxa){
        this.taxa = JSON.parse(local_storage_taxa) ?? [];
    }
    this.places = [];
    local_storage_taxa = localStorage.getItem('places');
    if(local_storage_taxa){
        this.places = JSON.parse(local_storage_taxa);
    }

    this.options = [];
    let local_storage_options = localStorage.getItem('options');
    if(local_storage_options){
      this.options = JSON.parse(local_storage_options)
    }
  }

  updateTaxa(taxa:Taxon[]){
    this.taxa = taxa;
    localStorage.setItem('taxa',JSON.stringify(taxa))
  }

  updatePlace(places:Place[]){
    this.places = places;
    localStorage.setItem('places',JSON.stringify(places))
  }


  updateOptions(options:string[]){
    this.options = options;
    localStorage.setItem('options',JSON.stringify(this.options));
    console.log(options)
  }

  getOptions():string[][]{
    return this.options.map( o => [o,'true'] )
  }

  getTaxaID():number[]{
      return this.taxa?.map(t => t.id) ?? []
  }

  getPlaceID():number[]{
    return this.places?.map(t => t.id) ?? []
  }

  getPreferences(){

    let pref = [
      [ 'taxon_id', this.getTaxaID().join(',') ],
      [ 'place_id',this.getPlaceID().join(',')] ]

    pref.push(...this.getOptions())

    return pref
  }

  baseOptions = [
    { name: 'endemic', checked: false, label: 'Endemic' },
    { name: 'captive', checked: false, label: 'Captive/Cultivated'},
    { name: 'introduced', checked: false, label: 'Introduced' },
    { name: 'native', checked: false, label: 'Native' },
    { name: 'outOfRange', checked: false, label: 'Out of Range' },
    { name: 'threatened', checked: false, label: 'Threatened' }  
  ]
  
}
