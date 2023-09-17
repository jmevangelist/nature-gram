import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyValue } from '../shared/generic.interface';
import { TaxonomyNode } from '../inaturalist/inaturalist.interface';
import { InaturalistToolsService } from '../inaturalist/inaturalist-tools.service';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { Router } from '@angular/router';
import { ClarityIcons, refreshIcon } from '@cds/core/icon';
import { IntWordPipe } from '../shared/int-word.pipe';

@Component({
  selector: 'app-taxonomy',
  standalone: true,
  imports: [CommonModule,ClarityModule,IntWordPipe],
  templateUrl: './taxonomy.component.html',
  styleUrls: ['./taxonomy.component.css']
})
export class TaxonomyComponent {
  taxonomy!:TaxonomyNode[];
  btnState: ClrLoadingState;
  private _params!:KeyValue;
  private _tailId!:number;
  private inatTools:InaturalistToolsService;

  @Input() set params(params:KeyValue){
    this._params = params;
    this.qTaxonomy().then(()=>{
      if(this._tailId){
        this.chainTaxonomy(this.taxonomy,this._tailId)
      }
    })
  }

  @Input() set tailId(tailId:number){
    this._tailId = tailId;
    if(this.taxonomy.length){
      if(tailId){
        this.chainTaxonomy(this.taxonomy,tailId);
      }else if(tailId === 0){
        this.taxonomy.length = 1;
      }
    }
  }

  @Output() tailChange:EventEmitter<TaxonomyNode>

  constructor(private router:Router){
    this.inatTools = inject(InaturalistToolsService);
    this.tailChange = new EventEmitter<TaxonomyNode>;
    this.btnState = ClrLoadingState.DEFAULT;
    this.taxonomy = []
    ClarityIcons.addIcons(refreshIcon);
  }

  private async qTaxonomy(){
    this.btnState = ClrLoadingState.LOADING;
    let head = await this.inatTools.getTaxonomy(this._params)
    this.taxonomy = [head];
    this.btnState = ClrLoadingState.DEFAULT;
  }

  private chainTaxonomy(txArr:TaxonomyNode[],id:number):boolean{
    let fI = txArr.findIndex(t=>t.id == id) 
    if( fI >= 0){
      txArr.splice(fI+1);
      return true;
    }

    let lastNode = txArr[txArr.length-1]
    if(lastNode.id == id){
      return true
    }
    if(lastNode.descendant){
      for(let i=0;i<lastNode.descendant.length;i++){
        txArr.push(lastNode.descendant[i])
        if(!this.chainTaxonomy(txArr,id)){
          txArr.pop()
        }else{
          return true;
        }
      }
      return false
    }else{
      return false
    }
  }

  selectTaxon(t:TaxonomyNode,index:number){
    if(this.taxonomy.length-1 > index){
      this.taxonomy.splice(index+1);
    }
    this.taxonomy.push(t)
    this.tailChange.emit(t)

    let params: KeyValue = {};
    let qp = this.router.lastSuccessfulNavigation?.extractedUrl.queryParams ?? {};
   
    Object.keys(qp).forEach(k=>{
      params[k] = qp[k]
    })

    if(t.id > 0){
      params['taxon_id'] = t.id;
      delete params['identified'];
    }else if(t.id == -1){
      params['identified'] = false;
      delete params['taxon_id'];
    }

    this.router.navigate([],{queryParams: params})
  }

  resetTaxonomy(){
    this.taxonomy.length = 1;
    let qp = this.router.lastSuccessfulNavigation?.extractedUrl.queryParams ?? {}
    let params: KeyValue = {};
    Object.keys(qp).forEach(k=>{
      params[k] = qp[k]
    })
    delete params['identified'];
    delete params['taxon_id'];
    this.router.navigate([],{queryParams: params})
    this.tailChange.emit(this.taxonomy[0])
  }

}
