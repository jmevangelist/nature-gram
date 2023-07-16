import { Injectable, inject } from '@angular/core';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observable, interval, startWith, switchMap } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class NotificationService{

    private inatServe = inject(InaturalistService)
    private lastCheck!: number;
    notification$: Observable<number>;

    constructor(){
        if(localStorage.getItem('lastnotifcheck')){
            this.lastCheck = parseInt( localStorage.getItem('lastnotifcheck') ?? '0')           
        }else{
            this.lastCheck = Date.parse('Jun 10 2023')
        }

        this.notification$ = interval(1000*60*5).pipe(
            startWith(-1),
            switchMap((n)=> this.getUpdates(this.lastCheck))
        )
    }

    private async getUpdates(timeStamp:number):Promise<number>{
        let date = new Date(timeStamp).toString();
        let results = await this.inatServe.getObservationsUpdates({created_after: date});
        return results.total_results
    }

    setLastCheck(){
        this.lastCheck = Date.now();
        localStorage.setItem('lastnotifcheck',this.lastCheck.toString())
    }
    
}