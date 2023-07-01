import { Injectable } from '@angular/core';
import { Observation } from '../inaturalist.interface'

@Injectable({
    providedIn: 'root'
  })

export class HomeService {
    Observations: Observation[] = [];
    calls: number = 0
    popular_page: number = 1;
    prev_scroll:number | undefined = 0;

    private now = Date();
    private createdD1 = new Date(Date.now() - (3*24*60*60*1000))

    private popular: string[][] = [
        ['popular','true'],
        ['created_d1',this.createdD1.toString()],
        ['created_d2',this.now],
        ['order_by','votes'],
        ['page','1'],
        ['per_page','10']]

    extraParams():string[][]|undefined{
        let params = undefined
        if(this.calls%2){
            params = [
                ['order_by', 'random'], 
                this.popular[1], 
                ['created_d2', Date()],
                ['per_page', Math.ceil(Math.random() * 15).toString()]
            ]
        }else{
            this.popular[4][1] = this.popular_page.toString();
            this.popular[5][1] = Math.ceil(Math.random() * 15).toString()
            params = this.popular
            this.popular_page++
        }
        this.calls++
        return params
    }

    refresh(){
        this.now = Date();
        this.createdD1 = new Date(Date.now() - (3*24*60*60*1000))
        this.Observations = [];
    }
}