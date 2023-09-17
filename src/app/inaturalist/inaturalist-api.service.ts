import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, share } from 'rxjs/operators';
import { Observation, Relationship, Results, ResultsRelationship } from './inaturalist.interface';
import { AuthorizationService } from '../authorization/authorization.service';
import { KeyValue } from '../shared/generic.interface';
import { InaturalistFieldsService } from './inaturalist-fields.service';

@Injectable({
    providedIn: 'root'
})

export class InaturalistAPIService {
    constructor(private http: HttpClient,private authService:AuthorizationService,private fieldConfig:InaturalistFieldsService) { }
    private baseURL = 'https://api.inaturalist.org'  

    private paths = {
        observation: '/v2/observations',
        relationship: '/v2/relationships'
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else if(error.status == 401){
            this.authService.setExpired();
            console.log('Token expired')
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }

    getRelationships(q:string):Observable<Relationship[]>{
        if(this.authService.isExpired){
            return new Observable<Relationship[]>
        }

        let token = this.authService.token;

        let params:HttpParams = new HttpParams(
            { fromObject: 
                {
                    'fields':'all',
                    'following':'yes',
                    'order_by':'users.login',
                    'order':'asc'
                }
            })
        
        if(q){
            params.append('q',q)
        }

        return this.http.get<Results>(`${this.baseURL}${this.paths.relationship}`,{
            headers: {'Authorization':token},
            params: params,
            responseType: 'json',
        }).pipe(
            catchError(this.handleError.bind(this)),
            map(results=>{
                return results.results as Relationship[]
            })
        )
    }

    getObservations(optParams?:KeyValue):Observable<Observation[]>{

        let params:HttpParams = new HttpParams({
            fromObject: {
                'photo_licensed': true,
                'photos': true,
                'fields': this.fieldConfig.fields.observation
            }
        })

        if(optParams){
            Object.keys(optParams).forEach(k=>{
                if(optParams[k]){
                    params.append(k,optParams[k]?.toString() ?? '')
                }
                optParams[k] = optParams[k]?.toString()
            })

            let opt:any = Object.assign({},optParams)

            params = params.appendAll(opt)
            
        }
    
        return this.http.get<Results>(`${this.baseURL}${this.paths.observation}`,{
            params: params,
            responseType: 'json',
        }).pipe(
            catchError(this.handleError.bind(this)),
            map(results=>{
                for (let obs of results.results as Observation[]){
                    if(obs.photos){
                      for (let photo of obs.photos){
                        photo.url = photo.url.replace('square','medium')
                      }
                    }
                }
                return results.results as Observation[]
            })
        )

    }

}