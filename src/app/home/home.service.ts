import { Injectable, inject } from '@angular/core';
import { Observation } from '../inaturalist/inaturalist.interface'
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PreferenceService } from '../preference/preference.service';

@Injectable({
    providedIn: 'root'
  })

export class HomeService {
    loading$: Observable<boolean>;
    observations$: Observable<Observation[]>;

    private observations: Observation[];
    private observationsSubject: BehaviorSubject<Observation[]>;
    private busy: BehaviorSubject<boolean>;

    private calls: number = 0
    private inatService: InaturalistService = inject(InaturalistService)
    private prefservice = inject(PreferenceService)
    private popular_params: any;
    private recent_params: any;

    constructor(){
        this.busy = new BehaviorSubject<boolean>(true);
        this.observations = []
        this.observationsSubject = new BehaviorSubject<Observation[]>([]);
        this.loading$ = this.busy.asObservable();
        this.observations$ = this.observationsSubject.asObservable();

        this.popular_params = {
            popular: 'true',
            order_by: 'updated_at',
            per_page: '5',
            page: '1'
        }

        this.recent_params = {
            popular: 'false',
            order_by: 'updated_at',
            per_page: '5',
            page: '1'
        }
    
    }

    extraParams():string[][]|undefined{
        let pref = this.prefservice.getPreferences();
        let paramsArray: string[][] = []

        if( parseInt(this.recent_params.page) && parseInt(this.popular_params.page)){
            if(this.calls%2){
                paramsArray = Object.keys(this.recent_params).map((key) => [key, this.recent_params[key]]);
                this.recent_params.page = (parseInt(this.recent_params.page)+1).toString();
            }else{
                paramsArray = Object.keys(this.popular_params).map((key) => [key, this.popular_params[key]]);
                this.popular_params.page = (parseInt(this.popular_params.page)+1).toString();
            }
        }else if (parseInt(this.popular_params.page)){
            paramsArray = Object.keys(this.popular_params).map((key) => [key, this.popular_params[key]]);
            this.popular_params.page = (parseInt(this.popular_params.page)+1).toString();

        }else if (parseInt(this.recent_params.page)){
            paramsArray = Object.keys(this.recent_params).map((key) => [key, this.recent_params[key]]);
            this.recent_params.page = (parseInt(this.recent_params.page)+1).toString();
        }else{
            return undefined
        }
        
        if(pref.length){

            pref.forEach( (v)=>{ 
                if(v[1]){
                    paramsArray.push(...[v]) 
                }
            })

        }

        this.calls++
        return paramsArray
    }

    disableLastParams(){
        if(this.calls%2){
            this.popular_params.page = '0'
        }else{
            this.recent_params.page = '0'
        }
    }

    refresh(){
        this.popular_params.page = '1'
        this.recent_params.page = '1'
        this.observations.length = 0;
        this.observationsSubject.next([]);
    }

    async loadObservations():Promise<boolean>{
        this.busy.next(true);
        let params = this.extraParams();

        if(!params){
            this.busy.next(false)
            return false 
        }

        let obs:Observation[] = [] 
        
        try{
            obs = await this.inatService.getObservations(params)
        }catch(e){
            console.log(e)
            this.busy.next(false)
            this.observationsSubject.next(this.observations)
            return false
        }

        if(obs.length){
            if(obs.length < 5){
                this.disableLastParams()
            }

            let newObs = obs.filter(o => this.observations.findIndex( ob => ob.id == o.id) == -1 )

            if(newObs.length){
                this.observations.push(...newObs)
                this.observationsSubject.next(this.observations)
            }else{
                return await this.loadObservations();
            }
        }else{
            this.disableLastParams()
            return await this.loadObservations()
        }

        this.busy.next(false)
        return true                                                                         
    }

}