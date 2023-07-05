import { Injectable, inject } from '@angular/core';
import { Observation } from '../inaturalist.interface'
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable({
    providedIn: 'root'
  })

export class HomeService {
    Observations: Observation[] = [];
    calls: number = 0
    popular_page: number = 1;

    private timeDiff = (1*5*60*60*1000)
    private now = Date();
    private createdD1 = new Date(Date.now() - this.timeDiff)
    private authService: AuthorizationService = inject(AuthorizationService)

    private base: string[][] = [
        ['popular','true'],
        ['created_d1',this.createdD1.toString()],
        ['created_d2',this.now],
        ['order_by','votes'],
        ['per_page','5']]

    extraParams():string[][]|undefined{
        let params = Array.from(this.base)
        let taxaPref = this.authService.getTaxaID();
        
        if(this.calls%2){
            params[0][1] = 'false'
            params[3][1] = 'random'
            params[2][1] = Date();
            params[4][1] =  Math.ceil(Math.random() * 15).toString()
        }else{
            let page = [[ 'page', this.popular_page.toString() ]]
            params.push(...page)
            params[0][1] = 'true'
            params[3][1] = 'votes'
            params[4][1] = '5'
            this.popular_page++
        }
        

        if(taxaPref.length){
            let taxon_id = [['taxon_id',taxaPref.join(',')]]
            params.push(...taxon_id)
        }

        this.calls++
        return params
    }

    pushBackDateRange(){
        this.base[2][1] = this.createdD1.toString()
        this.timeDiff = this.timeDiff*2
        this.createdD1 = new Date(Date.parse(this.createdD1.toString()) - this.timeDiff )
        this.base[1][1] = this.createdD1.toString()
        this.popular_page = 1
    }

    refresh(){
        this.now = Date();
        this.timeDiff = (1*5*60*60*1000)
        this.createdD1 = new Date(Date.now() - this.timeDiff)
        this.base[1][1] = this.createdD1.toString() 
        this.base[2][1] = this.now
        this.Observations.length = 0;
    }
}