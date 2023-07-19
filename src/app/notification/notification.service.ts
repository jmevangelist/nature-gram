import { Injectable, inject } from '@angular/core';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observable, filter, interval, startWith, switchMap } from 'rxjs';
import { AuthorizationService } from '../authorization/authorization.service';


@Injectable({
    providedIn: 'root'
})

export class NotificationService{

    private inatServe = inject(InaturalistService)
    private authServe = inject(AuthorizationService)
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
            filter(()=> !this.authServe.isExpired ),
            switchMap(()=> this.getUpdates(this.lastCheck) )
        )
    }

    private async getUpdates(timeStamp:number):Promise<number>{
        let date = new Date(timeStamp).toString();
        
        let results = await this.inatServe.getObservationsUpdates({
            created_after: date, 
            observations_by: 'following',
        });
        let resultsO = await this.inatServe.getObservationsUpdates({
            created_after: date, 
            observations_by: 'owner',
        });


        return results.total_results + resultsO.total_results
    }

    setLastCheck(){
        this.lastCheck = Date.now();
        localStorage.setItem('lastnotifcheck',this.lastCheck.toString())
    }
    
}