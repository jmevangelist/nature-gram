import { Injectable } from '@angular/core';
import { Observation } from './inaturalist';

@Injectable({
  providedIn: 'root'
})



export class InaturalistService {
  url = new URL('https://api.inaturalist.org/v2/observations');
  counter:number = 0 

  async getObservations(opt_params?:string[][]): Promise<Observation[]>{
    const params = [['photos', 'true'],
              ['fields', 
              "(id:!t,time_observed_at:!t,user:(name:!t,login:!t,icon:!t),place_guess:!t,taxon:(name:!t,preferred_common_name:!t,iconic_taxon_name:!t),photos:(url:!t,original_dimensions:(height:!t,width:!t)))"]]
    if(opt_params){
      params.push(...opt_params)
    }

    this.url.search =  new URLSearchParams(params).toString()

    const response = await fetch(this.url);
    const data = await response.json() ?? {};
    const observations:Observation[] = data.results ?? []
    for (let obs of observations){
      if(obs.photos){
        for (let photo of obs.photos){
          photo.url = photo.url.replace('square','medium')
        }
      }else{
        obs.photos = []
      }
    }
    this.counter++

    return observations
  }
}
