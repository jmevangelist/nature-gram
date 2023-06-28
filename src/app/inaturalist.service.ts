import { Injectable,inject } from '@angular/core';
import { Observation } from './inaturalist.interface';
import { InaturalistConfigService } from './inaturalist-config.service'
declare const rison: any; 

@Injectable({
  providedIn: 'root'
})

export class InaturalistService {
  url = new URL('https://api.inaturalist.org/v2/observations');
  counter:number = 0 
  fields = rison.encode(inject(InaturalistConfigService).Observation)

  async getObservations(opt_params?:string[][]): Promise<Observation[]>{
    
    const params = [['photos', 'true'],
              ['fields', this.fields ]]
    
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
      }
    }
    this.counter++

    return observations
  }

}

