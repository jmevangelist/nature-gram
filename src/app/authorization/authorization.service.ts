import { Injectable, Injector } from '@angular/core';
import { User } from '../inaturalist/inaturalist.interface';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthorizationService{
    private api_token: string = localStorage.getItem('api_token') ?? ''
    private authorized_user?: User;
    private expired: boolean = true;
    private expiredSubject: BehaviorSubject<boolean>;
    expired$: Observable<boolean>;

    constructor(private injector: Injector){
        let local_storage_auth_user = localStorage.getItem('authorized_user');
        if(local_storage_auth_user){
            this.authorized_user = JSON.parse(local_storage_auth_user)
        }

        if(this.api_token){
            this.expired = false;
        }
        this.expiredSubject = new BehaviorSubject<boolean>(this.expired);
        this.expired$ = this.expiredSubject.asObservable();
    }

    get token(){
        return this.api_token
    }

    get me(){
        return this.authorized_user
    }

    get isExpired(){
        return this.expired
    }

    getStatus():'none'|'expired'|'authorized'{
        if(!this.token){
            return 'none'
        }else if(this.expired){
            return 'expired'
        }else{
            return 'authorized'
        }
    }

    setExpired(){
        this.api_token = '';
        this.expired = true;
        this.expiredSubject.next(true);
    }

    private setToken(token:string){
        this.api_token = token
        this.expired = false
        this.expiredSubject.next(false);
        localStorage.setItem('api_token',token)
    }

    private setMe(me:User){
        this.authorized_user = me;
        localStorage.setItem('authorized_user',JSON.stringify(me))
    }

    async auth(token:string):Promise<Boolean>{
        const inatService = this.injector.get(InaturalistService)
        let success = false;

        try{
            let user = await inatService.getMe(token)
            if(user){
                this.setMe(user)
                this.setToken(token)
                success = true
            }
        }catch(e){
            console.log(e)
        }finally{
            return success
        }
    }

    logout(){
        localStorage.removeItem('api_token');
        localStorage.removeItem('authorized_user');
        this.api_token = ''
        this.authorized_user = undefined;
        this.expired = true;
        this.expiredSubject.next(true);
    }
}