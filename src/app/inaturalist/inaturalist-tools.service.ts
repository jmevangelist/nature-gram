import { Injectable,inject } from '@angular/core';
import { InaturalistService } from './inaturalist.service';
import { TaxonomyNode, TaxonomyResult } from './inaturalist.interface';

@Injectable({
    providedIn: 'root'
})

export class InaturalistToolsService{
    inaturalistService!: InaturalistService

    constructor(){
        this.inaturalistService = inject(InaturalistService);
    }

    async getTaxonomy(params:any,simplify?:boolean):Promise<TaxonomyNode>{
        let paramsArray:string[][] = [];

        Object.keys(params).forEach(k=>{
            if(params[k]){
                paramsArray.push(...[[k,params[k].toString()]])
            }
        })

        let tx = await this.inaturalistService.getObservationsTaxonomy(paramsArray)

        let tHead = this.buildTaxonTree(tx)
        if(simplify === undefined || simplify){
            this.simplifyTaxonTree(tHead)
        }
        
        return tHead

    }

    private buildTaxonTree(tx:TaxonomyResult):TaxonomyNode{
        let tHead:TaxonomyNode = {
          id: 0,
          name: 'All',
          count: 0,
          descendant: [],
          descendant_obs_count: 0
        }
        let arrtx:TaxonomyNode[] = [];
        tx.results.forEach((t:TaxonomyNode)=>{
          t.descendant = [];
          if(arrtx[t.id]){
            t.descendant.push(...arrtx[t.id].descendant ?? []);
          }
          arrtx[t.id] = t
          if(t.parent_id){
            if(!arrtx[t.parent_id]){
              arrtx[t.parent_id] = {
                descendant: [],
                descendant_obs_count: 0,
                id: 0,
                name: 'temp',
                count: 0
              }
            }
            arrtx[t.parent_id].descendant?.push(t)
          }else{
            if( (t.direct_obs_count ?? 0) < tx.count_without_taxon){
              tHead.descendant?.push(t)
              tHead.descendant_obs_count = (t.descendant_obs_count ?? 0) 
              tHead.descendant?.push({
                id: -1,
                name: 'Unidentified',
                count: tx.count_without_taxon - (t.direct_obs_count ?? 0),
                descendant_obs_count: tx.count_without_taxon - (t.direct_obs_count ?? 0),
                descendant: []
              })
              tHead.descendant_obs_count = tx.count_without_taxon - (t.direct_obs_count ?? 0) + t.descendant_obs_count
            }else{
              tHead = t
            }
          }
        })
    
        return tHead
      }
    
      private simplifyTaxonTree(node:TaxonomyNode){
        node.descendant?.forEach((d,i)=>{
          if((d.direct_obs_count == 0)&&(d.descendant?.length == 1)){
            if(node.descendant){
              
              let desc = d.descendant.at(0)
              while(desc.descendant?.length == 1){
                desc = desc.descendant.at(0)
              }
              node.descendant[i] = desc 
            }
          }
        })
        node.descendant?.forEach((d)=>{
          this.simplifyTaxonTree(d)
        })
      }

}
