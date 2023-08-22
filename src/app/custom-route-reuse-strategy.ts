import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy,} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private routeStore = new Map<string, DetachedRouteHandle>();

  private paths = [
    'naturalist/:user_login',
    'observation/:uuid',
    'home',
    'following',
    'taxon/:id',
    'search',
    'projects/:slug',
    'projects'
]

  private getPath(route: ActivatedRouteSnapshot):string{
    return `${route.parent?.routeConfig?.path ?? ''}${ (route.parent?.routeConfig?.path && route.routeConfig?.path) ? '/':''}${route.routeConfig?.path?? ''}`
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);    
    return this.paths.includes(path)
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    let routeRef = route.url.toString()
    this.routeStore.set(routeRef, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    let routeRef = route.url.toString()    
    let storedRoute = this.routeStore.get(routeRef)
    return (Boolean(path) && this.paths.includes(path) && !!storedRoute)
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    let routeRef = route.url.toString()
    return this.routeStore.get(routeRef) ?? {};
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}