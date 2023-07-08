import { Injectable,inject } from '@angular/core';
import { Observation, User, Taxon } from './inaturalist.interface';
import { InaturalistFieldsService } from './inaturalist-fields.service'
import { AuthorizationService } from '../authorization/authorization.service';
declare const rison: any; 

@Injectable({
  providedIn: 'root'
})

export class InaturalistService {
  base_url = 'https://api.inaturalist.org'  
  inaturalistConfig: InaturalistFieldsService = inject(InaturalistFieldsService)
  authService: AuthorizationService = inject(AuthorizationService)

  async getObservations(opt_params?:string[][]): Promise<Observation[]>{
    const url = new URL('v2/observations',this.base_url);
    const fields = this.inaturalistConfig.fields.observation;
    const params = [
              ['photos', 'true'],
              ['fields', fields ]
            ];
    
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

  async getMe(token:string): Promise<User | undefined>{

    const url = new URL('v2/users/me',this.base_url);
    url.search = new URLSearchParams([['fields','all']]).toString();
    
    let response = await fetch(url, { 
      headers: { "Authorization": token }
    })

    if(!response.ok){
      throw response.status
    }

    let data = await response.json() ?? {}
    if(data){
      const user: User = data.results[0]
      return user
    }else{
      return undefined
    }

    
  }

  async fave(uuid:string,toFave:boolean){
    const url = new URL(`v2/observations/${uuid}/fave`,this.base_url);
    let token = this.authService.token

    let response = await fetch(url,{
      method: toFave ? "POST": "DELETE",
      headers: { "Authorization": token }
    })

    if(!response.ok){
      if(response.status == 401){
        this.authService.setExpired();
      }
      throw response.statusText
    }

    return true
  }

  async taxaAutoComplete(q:string):Promise<Taxon[]>{
    const url = new URL('/v2/taxa/autocomplete',this.base_url);
    url.search = new URLSearchParams([
      ['fields',rison.encode(this.inaturalistConfig.Taxon_search) ],
      ['q',q],
      ['per_page',5]
    ]).toString();

    let response = await fetch(url)

    if(!response.ok){
      throw response.status 
    }

    let data = await response.json()

    return data.results

  }

}
