import { Injectable,inject } from '@angular/core';
import { Observation, User } from './inaturalist.interface';
import { InaturalistConfigService } from './inaturalist-config.service'
declare const rison: any; 

@Injectable({
  providedIn: 'root'
})

export class InaturalistService {
  base_url = 'https://api.inaturalist.org'  
  counter:number = 0 
  inaturalistConfig: InaturalistConfigService = inject(InaturalistConfigService)

  async getObservations(opt_params?:string[][]): Promise<Observation[]>{
    const url = new URL('v2/observations',this.base_url);
    const fields = rison.encode(this.inaturalistConfig.Observation)
    const params = [['photos', 'true'],
              ['fields', fields ]]
    
    if(opt_params){
      params.push(...opt_params)
    }

    url.search =  new URLSearchParams(params).toString()

    const response = await fetch(url);
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

  async getUserByLogin(user_login:string): Promise<User | undefined>{
    const url_autocomplete = new URL('v2/users/autocomplete',this.base_url);
    let params = [['q',user_login],['fields','login']];
    url_autocomplete.search = new URLSearchParams(params).toString();
  
    let response = await fetch(url_autocomplete);
    let data = await response.json() ?? {};
    const user = data.results.filter((u:any)=> u.login == user_login);

    if(!user){
      return undefined;
    }
    const url = new URL(`v2/users/${user[0].id}`,this.base_url);
    params = [['fields',rison.encode(this.inaturalistConfig.UserAll)]];
    url.search = new URLSearchParams(params).toString();

    response = await fetch(url);
    data = await response.json() ?? {};
    let users = data.results 

    if(data.total_results == 1){
      return users[0]
    }else{
      return undefined
    }

  }

}
