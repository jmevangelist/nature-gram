import { Injectable, inject } from '@angular/core';
import { Observation } from '../inaturalist/inaturalist.interface'
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable({
    providedIn: 'root'
  })

export class HomeService {
    Observations: Observation[] = [];
    calls: number = 0

    private timeDiff = (1*24*60*60*1000)

    private authService: AuthorizationService = inject(AuthorizationService)

    private popular_timeDiff = this.timeDiff;
    private recent_timeDiff = this.timeDiff;
    private popular_params: any;
    private recent_params: any;

    constructor(){
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
        let taxaPref = this.authService.getTaxaID();
        let paramsArray: string[][] = []

        if(this.calls%2){
            paramsArray = Object.keys(this.recent_params).map((key) => [key, this.recent_params[key]]);
            this.recent_params.page = (parseInt(this.recent_params.page)+1).toString();
        }else{
            paramsArray = Object.keys(this.popular_params).map((key) => [key, this.popular_params[key]]);
            this.popular_params.page = (parseInt(this.popular_params.page)+1).toString();
        }
        
        if(taxaPref.length){
            let taxon_id = [['taxon_id',taxaPref.join(',')]]
            paramsArray.push(...taxon_id)
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

        this.Observations.length = 0;
    }
}