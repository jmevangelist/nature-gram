import { Injectable } from '@angular/core';
import { Taxon } from '../inaturalist/inaturalist.interface';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  taxa: Taxon[];

  constructor() {
    this.taxa = [];
    let local_storage_taxa = localStorage.getItem('taxa');
    if(local_storage_taxa){
        this.taxa = JSON.parse(local_storage_taxa) ?? [];
    }
  }

  updateTaxa(taxa:Taxon[]){
    this.taxa = taxa;
    localStorage.setItem('taxa',JSON.stringify(taxa))
  }

  getTaxaID():number[]{
      return this.taxa?.map(t => t.id) ?? []
  }

  getPreferences(){
    return [[ 'taxon_id', this.getTaxaID().join(',') ]]
  }
  
}
