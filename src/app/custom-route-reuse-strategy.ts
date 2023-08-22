import { LocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy,} from '@angular/router';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
    private routeStore = new Map<string, DetachedRouteHandle>();
    private isPopState: boolean;
    private prevRoute!: string;

    constructor(location:LocationStrategy){
        this.isPopState = false;

        location.onPopState(()=>{
            this.isPopState = true;
        })

    }

    private getRouteKey(route:ActivatedRouteSnapshot):string{
        return route.pathFromRoot
        .filter(u => u.url)
        .map(u => u.url)
        .join('/');
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data['saveComponent']
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        let routeRef = this.getRouteKey(route);
        this.routeStore.set(routeRef, handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        let routeRef = this.getRouteKey(route);  
        let storedRoute = this.routeStore.get(routeRef)

        if(!this.isPopState || !storedRoute){
            this.prevRoute = routeRef;
            return false
        }else if(this.prevRoute === routeRef){ 
            this.isPopState = false;
        }
        this.prevRoute = routeRef;

        return route.data['saveComponent']
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        let routeRef = this.getRouteKey(route);
        const handle = this.routeStore.get(routeRef) ?? {}
        return handle 

    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}