import { Injectable } from '@angular/core';
import { Place, Taxon } from '../inaturalist/inaturalist.interface';
import { BehaviorSubject, Observable, find } from 'rxjs';
import { FiltersProvider } from '@clr/angular/data/datagrid/providers/filters';
import { Preference } from './preferece.interface';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  taxa: Preference[];
  places: Preference[];
  options: string[];
  private _behaviorSubject: BehaviorSubject<null>
  signal: Observable<null>;

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

    this._behaviorSubject = new BehaviorSubject<null>(null);
    this.signal = this._behaviorSubject.asObservable();
  }

  updateTaxa(taxa:Preference[]){
    this.taxa = taxa;
    localStorage.setItem('taxa',JSON.stringify(taxa))
    this._behaviorSubject.next(null)
  }
  

  updatePlace(places:Preference[]){
    this.places = places;
    localStorage.setItem('places',JSON.stringify(places))
    this._behaviorSubject.next(null)
  }


  updateOptions(options:string[]){
    this.options = options;
    localStorage.setItem('options',JSON.stringify(this.options));
    this._behaviorSubject.next(null)
  }

  getOptions():string[][]{
    return this.options.map( o => [o,'true'] )
  }

  getTaxaID():number[]{
      return this.taxa?.filter(t=> t.active).map(t => t.taxon?.id || 0) ?? []
  }

  getPlaceID():number[]{
    return this.places?.filter(t=> t.active).map(t => t.place?.id || 0) ?? []
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
