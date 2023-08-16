import { EventEmitter, Injectable, inject } from '@angular/core';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observable, Subject, filter, from, fromEvent, interval, merge, share, shareReplay, startWith, switchMap } from 'rxjs';
import { AuthorizationService } from '../authorization/authorization.service';


@Injectable({
    providedIn: 'root'
})

export class NotificationService{

    private inatServe = inject(InaturalistService)
    private authServe = inject(AuthorizationService)
    private lastCheck!: number;
    private checked$: Subject<void>;
    notification$: Observable<number>;

    constructor(){
        this.checked$ = new Subject<void>();

        if(localStorage.getItem('lastnotifcheck')){
            this.lastCheck = parseInt( localStorage.getItem('lastnotifcheck') ?? '0')           
        }else{
            this.lastCheck = (Date.now() - 1000*60*60*24)
        }

        this.notification$ = merge(interval(1000*60*5),this.checked$,this.authServe.expired$).pipe(
            startWith(-1),
            filter((n)=> { 
                return !this.authServe.isExpired 
            }),
            switchMap((n)=> { 
                if(n===undefined || n === true){
                    return this.foo();
                }else{
                    return this.getUpdates(this.lastCheck)
                }
            }),
            shareReplay()
        )
    }

    async foo(){
        return 0
    }

    private async getUpdates(timeStamp:number):Promise<number>{
        let date = new Date(timeStamp).toString();
        let total = 0 

        try {
            let results = await this.inatServe.getObservationsUpdates({
                created_after: date, 
                observations_by: 'following',
            });
            total += results.total_results
        } catch (error) {
            return 0
        }

        try {
            let resultsO = await this.inatServe.getObservationsUpdates({
            created_after: date, 
            observations_by: 'owner',
            });
            total += resultsO.total_results
        } catch (error) {
            return 0
        }

        return total
    }

    setLastCheck(){
        this.checked$.next();
        this.lastCheck = Date.now();
        localStorage.setItem('lastnotifcheck',this.lastCheck.toString())
    }
    
}