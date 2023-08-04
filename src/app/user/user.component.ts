import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation, User, SpeciesCount, SpeciesTreeCount, Taxon, TaxonomyNode, TaxonomyResult } from '../inaturalist/inaturalist.interface';
import { ClarityModule, ClrLoadingButton, ClrLoadingState } from '@clr/angular'
import { HeaderComponent } from '../header/header.component';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { UrlifyDirective } from '../shared/urlify.directive';
import { SquareGridDirective } from '../shared/square-grid.directive';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    HeaderComponent,
    RouterLink,
    IntersectionObserverDirective,
    UrlifyDirective,
    SquareGridDirective
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  inaturalistService: InaturalistService = inject(InaturalistService)

  user_login: string = ''
  observations: Observation[] = []
  user: User|undefined = undefined;
  following: boolean;
  relationshipID!: number | undefined;
  private page = 1
  observe: boolean = true;
  taxonId!: number;
  loadingObs: boolean = true;
  params!: string[][];
  taxonomy!: TaxonomyNode[];

  constructor(){
    this.user_login = this.route.snapshot.params['user_login'];
    this.following = false;
    this.inaturalistService.getUserByLogin(this.user_login)
    .then( (user:User | undefined) => {
      this.user = user
      this.getTaxonomy();
    })
    this.params = [
      ['user_login',this.user_login],
      ['page',this.page.toString()]]
  }

  intersected(){
    this.getObservations();
  }

  ngOnInit(): void {
    this.inaturalistService.getRelationships(this.user_login).then((r:any)=>{
      console.log(r)
      if(r.length){
        if(r[0].following){
          this.following = true;
          this.relationshipID = r[0].id;
        }
      }
    }).catch((e)=>{
      console.log(e)
    })
  }

  follow(button:ClrLoadingButton){
    button.loadingStateChange(ClrLoadingState.LOADING);
    if(this.following){
      this.inaturalistService.relationships(this.relationshipID).then(()=>{
        this.following = false;
        this.relationshipID = undefined;
      }).finally(()=>{
        button.loadingStateChange(ClrLoadingState.DEFAULT)
      })
    }else{
      this.inaturalistService.relationships(
        {'friend_id':this.user?.id,'following':true,'trust':false}).then((res)=>{
          console.log(res)
          this.following = true;
          this.relationshipID = res[0].id;
        }).finally(()=>{
          button.loadingStateChange(ClrLoadingState.DEFAULT)
        })
      
    }
  }

  private getObservations(){
    this.observe = false;
    this.loadingObs = true;
    this.inaturalistService.getObservations(this.params)
    .then( (observations:Observation[]) => {
      if(observations.length == 0){
        this.observe = false;
      }else{
        this.observations.push(...observations);
        this.page++
        this.params[1][1] = this.page.toString();
        this.observe = true;
      }
    }).finally(()=>{
      this.loadingObs = false;
    })
  }

  private async getTaxonomy(){
    let tx = await this.inaturalistService.getObservationsTaxonomy([['user_login',this.user_login]])
    let tHead = this.buildTaxonTree(tx)
    this.simplifyTaxonTree(tHead)
    this.taxonomy = [tHead];
    console.log(tHead)
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

  selectTaxon(t:TaxonomyNode,index:number){
    if(this.taxonomy.length-1 > index){
      this.taxonomy.splice(index+1);
    }
    this.taxonomy.push(t)

    this.observe = true;
    this.page = 1;
    this.params = [
      ['user_login',this.user_login],
      ['page',this.page.toString()]]

    if(t.id > 0){
      this.params.push(...[['taxon_id',t.id.toString()]])
    }else if (t.id == -1){
      this.params.push(...[['identified','false']])
    }
    this.observations = [];

  }

}
