import { Injectable,inject } from '@angular/core';
import { Observation, User, Taxon, Place, CommentsCreate, Comment, IdentificationsCreate, Identification, ObservationsUpdates, ResultsUpdates, SpeciesCount, TaxonomyResult, Project, ResultsSearch } from './inaturalist.interface';
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
              ['photo_licensed','true'],
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

  async getObservationsByUUID(uuid:string[]): Promise<Observation[]>{
    const url = new URL(`v2/observations/${uuid}`,this.base_url)
    let fields = this.inaturalistConfig.fields.observation_verbose;
    url.search = new URLSearchParams([['fields',fields]]).toString();

    const response = await fetch(url);
    const data = await response.json() ?? {};
    const observations:Observation[] = data.results ?? []

    for (let obs of observations){
      if(obs.photos){
        for (let photo of obs.photos){
          photo.url = photo.url.replace('square','original')
        }
      }
    }

    return observations
  }

  async getObservationsSpeciesCount(opt_params?:string[][]): Promise<SpeciesCount[]>{
    const url = new URL('v2/observations/species_counts',this.base_url);
    const fields = this.inaturalistConfig.fields.speciesCount;
    const params = [
              ['photo_licensed','true'],
              ['photos', 'true'],
              ['fields', fields ]
            ];
    
    if(opt_params){
      params.push(...opt_params)
    }

    url.search =  new URLSearchParams(params).toString()

    const response = await fetch(url);
    const data = await response.json();

    return data.results

  } 

  async getObservationsTaxonomy(opt_params?:string[][]): Promise<TaxonomyResult>{
    const url = new URL('v1/observations/taxonomy', this.base_url);
    url.search = new URLSearchParams(opt_params).toString();
    const response = await fetch(url);
    
    if(!response.ok){
      throw response.status 
    }

    const data = await response.json();
    return data
  }

  async getObservationTaxonSummaryByUUID(uuid:string): Promise<any>{
    const url = new URL(`v2/observations/${uuid}/taxon_summary`,this.base_url)
    url.search = new URLSearchParams([['fields','all']]).toString();

    const response = await fetch(url);
    const data = await response.json();

    return data 
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
    url.search = new URLSearchParams([['fields','all']]).toString();

    response = await fetch(url);
    data = await response.json() ?? {};
    let users = data.results 

    if(data.total_results == 1){
      return users[0]
    }else{
      return undefined
    }

  }

  async getTaxa(id:string[],fields?:string):Promise<Taxon[]>{
    const url = new URL(`/v2/taxa/${id}`,this.base_url);
    if(!fields){
      fields = rison.encode(this.inaturalistConfig.Taxon_search)
    }else if(fields == 'all'){
      fields = rison.encode(this.inaturalistConfig.Taxon_verbose)
    }
    url.search = new URLSearchParams([
      ['fields', fields ?? 'all' ],
    ]).toString();

    let response = await fetch(url)

    if(!response.ok){
      throw response.status 
    }

    let data = await response.json()

    return data.results
  }

  async taxaAutoComplete(q:string):Promise<Taxon[]>{
    const url = new URL('/v2/taxa/autocomplete',this.base_url);
    url.search = new URLSearchParams([
      ['fields',rison.encode(this.inaturalistConfig.Taxon_search) ],
      ['q',q],
    ]).toString();

    let response = await fetch(url)

    if(!response.ok){
      throw response.status 
    }

    let data = await response.json()

    return data.results

  }

  async searchPlaces(q:string):Promise<Place[]>{
    const url = new URL('/v2/places',this.base_url);
    url.search = new URLSearchParams([
      ['fields','id,display_name'],
      ['q',q],
      ['geo','true']
    ]).toString();

    let response = await fetch(url)

    if(!response.ok){
      throw response.status 
    }

    let data = await response.json()

    return data.results

  }

  async search(q:string,sources?:string[],page?:number):Promise<ResultsSearch>{
    const url = new URL('v2/search',this.base_url);
    let params = [['q',q],['fields','all']];
    if(sources?.length){
      params.push(...[['sources',`${sources}`]])
    }
    if(page){
      params.push(...[['page',page.toString()]])
    }
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url);
    if(!response.ok){
      throw response.status
    }
    let data = await response.json();
    return data;
  }

  async getProjectsByUserID(id:number):Promise<Project[]>{
    const url = new URL(`v2/users/${id}/projects`,this.base_url);
    url.search = new URLSearchParams([['fields','id,description,icon,title,header_image_url,banner_color']]).toString();
    let response = await fetch(url);
    let data = await response.json();
    return data.results
  }

  async getProjects(opt_params?:string[][]):Promise<Project[]>{
    const url = new URL('v2/projects',this.base_url);
    let params = [['fields','title,description,icon,id,header_image_url,banner_color,slug']]
    if(opt_params){
      params.push(...opt_params);
    }
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url);
    let data = await response.json();
    return data.results
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

  async getRelationships(q:string): Promise<any>{
    const url = new URL('v2/relationships',this.base_url);
    let token = this.authService.token;

    let params = [
      ['fields','all'],
      ['following','yes'],
      ['order_by','users.login'],
      ['order','asc']
    ]

    if(q){ params.push(['q',q]) }

    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url,{ headers: {'Authorization': token} })
    if(!response.ok){
      if(response.status == 401){
        this.authService.setExpired();
      }
      throw response.statusText
    }
    let res = await response.json();
    return res.results; 
  }

  async relationships(relationship?:any): Promise<any>{

    let token = this.authService.token;
    let method = 'POST'
    let options:{[key:string]:any} = {
      headers: { 
        "Authorization": token,
        "Content-Type": "application/json" 
      }
    }

    let _url = 'v2/relationships'
    if(typeof relationship == 'number'){
      method = 'DELETE';
      _url = `${_url}/${relationship}`;
    }else{
      options['body'] = JSON.stringify({'fields':'all','relationship':relationship})
    }
    options['method'] = method

    const url = new URL(_url,this.base_url);
    let response = await fetch(url,options)

    if(!response.ok){
      if(response.status == 401){
        this.authService.setExpired();
      }
      throw response.statusText
    }

    if(method=='POST'){
      let res = await response.json()
      return res.results
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

  async quality(uuid:string,metric:string,agree:boolean,method:'POST'|'DELETE'){
    const url = new URL(`v2/observations/${uuid}/quality/${metric}`,this.base_url);
    let token = this.authService.token

    url.search = new URLSearchParams([['agree',agree.toString()]]).toString();

    let response = await fetch(url,{
      method: method,
      headers: { "Authorization": token }
    })

    if(!response.ok){
      if(response.status == 401){
        this.authService.setExpired();
      }
      throw response.statusText
    }
    if(response.status == 204){
      return true
    } else {
      return false
    }
  }

  async comment(comment:CommentsCreate):Promise<Comment[]>{
    const url = new URL('v2/comments',this.base_url)
    let token = this.authService.token

    comment.fields = rison.encode(this.inaturalistConfig.Comment)

    let response = await fetch(url,{
      method: "POST",
      headers: { 
        "Authorization": token,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(comment)
    })

    if(!response.ok){
      if(response.status == 401){
        this.authService.setExpired();
      }
      throw response.statusText
    }
    let res = await response.json()

    return res.results
  }

  async identification(identification:IdentificationsCreate):Promise<Identification[]>{
    const url = new URL('v2/identifications',this.base_url);
    let token = this.authService.token 

    identification.fields = rison.encode(this.inaturalistConfig.Identification)

    let response = await fetch(url,{
      method: "POST",
      headers: { 
        "Authorization": token,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(identification)
    })

    if(!response.ok){
      if(response.status == 401){
        this.authService.setExpired();
      }
      throw response.statusText
    }
    let res = await response.json()

    return res.results

  }

  async getComputerVisionOnObs(uuid:string):Promise<Taxon[]>{
    const url = new URL(`v2/computervision/score_observation/${uuid}`,this.base_url)
    let token = this.authService.token 
    let fields = `(taxon:${rison.encode(this.inaturalistConfig.Taxon)})`

    url.search = new URLSearchParams([['fields',fields]]).toString()
    let response = await fetch(url,{
      method: "GET",
      headers: { 
        "Authorization": token,
        "Content-Type": "application/json" 
      }
    })

    if(!response.ok){
      if(response.status == 401){
        this.authService.setExpired();
      }
      throw response.statusText
    }
    let res = await response.json()

    if(res.common_ancestor){
      res.results.unshift(res.common_ancestor)
    }

    return res.results

  }

  async getObservationsUpdates(obsUpdate?:ObservationsUpdates):Promise<ResultsUpdates>{
    const url = new URL('v2/observations/updates',this.base_url);
    let token = this.authService.token 
    let fields = 'all'

    let params = [['fields',fields]]

    if(obsUpdate){
      Object.entries(obsUpdate).forEach((v)=>{
        params.push(v)
      })
    }

    url.search = new URLSearchParams(params).toString();

    let response = await fetch(url,{
      method: "GET",
      headers: { 
        "Authorization": token,
        "Content-Type": "application/json" 
      }
    })

    if(!response.ok){
      if(response.status == 401){
        this.authService.setExpired();
      }
      throw response.statusText
    }
    let res:ResultsUpdates = await response.json()

    return res
  }



}
