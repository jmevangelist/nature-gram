import { Injectable, inject } from '@angular/core';
import { Observation } from '../inaturalist/inaturalist.interface'
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { BehaviorSubject, InteropObservable, Observable, ObservableLike } from 'rxjs';
import { PreferenceService } from '../preference/preference.service';
import { objectsIcon } from '@cds/core/icon';

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
    private timeDiff = (1*24*60*60*1000)
    private prefservice = inject(PreferenceService)
    private popular_timeDiff = this.timeDiff;
    private recent_timeDiff = this.timeDiff;
    private popular_params: any;
    private recent_params: any;

    constructor(){
        this.busy = new BehaviorSubject<boolean>(true);
        this.observations = []
        this.observationsSubject = new BehaviorSubject<Observation[]>([]);
        this.loading$ = this.busy.asObservable();
        this.observations$ = this.observationsSubject.asObservable();

        let createdD1 = new Date(Date.now() - this.timeDiff)
        let now = Date();
        this.popular_params = {
            popular: 'true',
            created_d1: createdD1.toString(),
            created_d2: now,
            order_by: 'votes',
            per_page: '5',
            page: '1'
        }

        this.recent_params = {
            popular: 'false',
            created_d1: createdD1.toString(),
            created_d2: now, 
            order_by: 'created_at',
            per_page: '5',
            page: '1'
        }
    
    }

    extraParams():string[][]|undefined{
        let pref = this.prefservice.getPreferences();
        let paramsArray: string[][] = []

        if(this.calls%2){
            paramsArray = Object.keys(this.recent_params).map((key) => [key, this.recent_params[key]]);
            this.recent_params.page = (parseInt(this.recent_params.page)+1).toString();
        }else{
            paramsArray = Object.keys(this.popular_params).map((key) => [key, this.popular_params[key]]);
            this.popular_params.page = (parseInt(this.popular_params.page)+1).toString();
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

    pushBackDateRange(){
        if(this.calls%2){
            this.popular_timeDiff *=2;
            this.popular_params.created_d2 = this.popular_params.created_d1;
            let d1 = new Date(Date.parse(this.popular_params.created_d1)-this.popular_timeDiff)
            this.popular_params.created_d1 = d1.toString();
            this.popular_params.page = '1'            
        }else{
            this.recent_timeDiff *=2;
            this.recent_params.created_d2 = this.recent_params.created_d1;
            let d1 = new Date(Date.parse(this.recent_params.created_d1)-this.recent_timeDiff)
            this.recent_params.created_d1 = d1.toString();
            this.recent_params.page = '1'
        }
    }

    refresh(){
        this.recent_timeDiff = this.timeDiff;
        this.popular_timeDiff = this.timeDiff;

        let d1 = new Date(Date.now() - this.timeDiff)
        this.popular_params.created_d1 = d1.toString();
        this.popular_params.created_d2 = Date();
        this.popular_params.page = '1'
        this.recent_params.created_d1 = d1.toString();
        this.recent_params.created_d2 = Date();
        this.recent_params.page = '1'

        this.observations.length = 0;
        this.observationsSubject.next([]);
    }

    private paramsValidator (calls?:number):any {
        if(!calls){ calls = 1}
        if(calls>2){ return false }

        let params = this.extraParams();
        let sd2:string = params?.filter(p => p[0] == 'created_d2')[0][1] ?? ''

        let pd2 = new Date(Date.parse(sd2))
        if(pd2.getFullYear() < 2005){
            calls++
            return this.paramsValidator(calls)
        }
        return params
    }

    async loadObservations():Promise<boolean>{
        this.busy.next(true);
        let params = this.paramsValidator();

        if(!params){
            this.busy.next(false)
            console.log('reached 2005')
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
                this.pushBackDateRange()
            }

            let newObs = obs.filter(o => this.observations.findIndex( ob => ob.id == o.id) == -1 )

            if(newObs.length){
                this.observations.push(...newObs)
                this.observationsSubject.next(this.observations)
            }else{
                return await this.loadObservations();
            }
        }else{
            this.pushBackDateRange()
            return await this.loadObservations()
        }

        this.busy.next(false)
        return true                                                                         
    }

}