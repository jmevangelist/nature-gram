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
    private prefservice: PreferenceService = inject(PreferenceService)
    params: any;

    constructor(){
        this.busy = new BehaviorSubject<boolean>(true);
        this.observations = []
        this.observationsSubject = new BehaviorSubject<Observation[]>([]);
        this.loading$ = this.busy.asObservable();
        this.observations$ = this.observationsSubject.asObservable();

        this.params = {
            order_by: 'created_at',
            per_page: 5,
            page: 1
        }    
    }

    private extraParams():string[][]|undefined{
        let pref = this.prefservice.getPreferences();
        let paramsArray: string[][] = []

        if(!this.params.page){ return undefined } 
        
        paramsArray = Object.keys(this.params).map((key) => [key, this.params[key].toString()]);
        this.params.page += 1;
        
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

    refresh(){
        this.observations.length = 0;
        this.observationsSubject.next([]);
        this.params = {
            order_by: 'created_at',
            per_page: 5,
            page: 1
        }
    }

    reload(){
        this.observations = [];
        this.observationsSubject.next([]);
        this.params.page = 1
        return this.loadObservations()
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

            let newObs = obs.filter(o => this.observations.findIndex( ob => ob.id == o.id) == -1 )

            if(newObs.length){
                this.observations.push(...newObs)
                this.observationsSubject.next(this.observations)
                if(obs.length < 5){
                    this.busy.next(false)
                    return false
                }
            }else{
                return await this.loadObservations();
            }
        }else{
            this.busy.next(false)
            return false
        }

        this.busy.next(false)
        return true                                                                         
    }

    getObservations(){
        return this.observations
    }

    updateParams(key:string,value:any){
        this.params[key] = value
    }

}