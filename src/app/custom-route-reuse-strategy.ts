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

    private clearRouteStore(){
        this.routeStore.forEach(handle=>{
            if(handle){
                (handle as any).componentRef.destroy();
            }
        })
        this.routeStore.clear();
    }

    private deleteFirstRoute(){
        let k = this.routeStore.entries().next().value

        if(k[1]){
            k[1].componentRef.destroy();
            this.routeStore.delete(k[0])
        }
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data['saveComponent']
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        if (this.routeStore.size > 10 ){
            this.deleteFirstRoute();
        }
        this.routeStore.set(this.getRouteKey(route), handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        let routeRef = this.getRouteKey(route);  
        let storedRoute = this.routeStore.get(routeRef)

        if(!this.isPopState || !storedRoute){
            this.prevRoute = routeRef;
            if(storedRoute){
                let handle = this.routeStore.get(routeRef);
                (handle as any).componentRef.destroy();
            }
            return false
        }else if(this.prevRoute === routeRef){ 
            this.isPopState = false;
        }
        this.prevRoute = routeRef;

        return route.data['saveComponent']
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        const handle = this.routeStore.get(this.getRouteKey(route)) ?? {}
        return handle 
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}