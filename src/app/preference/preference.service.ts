import { Injectable } from '@angular/core';
import { Place, Taxon } from '../inaturalist/inaturalist.interface';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  taxa: Taxon[];
  places: Place[];

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
  }

  updateTaxa(taxa:Taxon[]){
    this.taxa = taxa;
    localStorage.setItem('taxa',JSON.stringify(taxa))
  }

  updatePlace(places:Place[]){
    this.places = places;
    localStorage.setItem('places',JSON.stringify(places))
  }

  getTaxaID():number[]{
      return this.taxa?.map(t => t.id) ?? []
  }

  getPlaceID():number[]{
    return this.places?.map(t => t.id) ?? []
  }

  getPreferences(){
    return [[ 'taxon_id', this.getTaxaID().join(',') ],['place_id',this.getPlaceID().join(',')]]
  }
  
}
