import { Injectable } from '@angular/core';
import { User } from '../inaturalist.interface';

@Injectable({
    providedIn: 'root'
})

export class AuthorizationService{
    api_token: string = localStorage.getItem('api_token') ?? ''
    authorized_user?: User;

    constructor(){
        let local_storage_auth_user = localStorage.getItem('authorized_user');
        if(local_storage_auth_user){
            this.authorized_user = JSON.parse(local_storage_auth_user)
        }
    }

    get token(){
        return this.api_token
    }

    get me(){
        if(!this.authorized_user){ return undefined }
        return this.authorized_user
    }

    setToken(token:string){
        this.api_token = token
        localStorage.setItem('api_token',token)
    }

    setMe(me:User){
        this.authorized_user = me;
        localStorage.setItem('authorized_user',JSON.stringify(me))
    }

    logout(){
        localStorage.removeItem('api_token');
        localStorage.removeItem('authorized_user');
        this.api_token = ''
        this.authorized_user = undefined;
    }
}