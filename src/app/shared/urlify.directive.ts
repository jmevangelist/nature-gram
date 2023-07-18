import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UrlifyComponent } from './urlify.component';

@Directive({
  selector: '[urlify]',
  standalone: true,
})
export class UrlifyDirective {

  constructor(
    private templateRef: TemplateRef<any>, 
    private viewContainerRef: ViewContainerRef,
  ){}

  private _compRef!: any;

  @Input() set urlify(url:string | any[]){

    if(!this._compRef){this.createComp()}

    this._compRef.instance.template = this.templateRef;

    if(typeof url == 'string'){
      this._compRef.instance.href = url
    }else{
      this._compRef.instance.custRouterLink = url;
    }

  }

  private createComp():void{
    this._compRef = this.viewContainerRef.createComponent(UrlifyComponent);
  }



}
