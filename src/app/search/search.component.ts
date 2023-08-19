import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { SubscriptionLike, debounceTime } from 'rxjs';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { ResultsSearch, Search } from '../inaturalist/inaturalist.interface';
import { TaxonComponent } from '../taxon/taxon.component';
import { ProjectCardComponent } from '../projects/project-card/project-card.component';
import { UserCardComponent } from '../user-card/user-card.component';
import { PlaceCardComponent } from '../place-card/place-card.component';
import { IntersectionObserverDirective } from '../shared/intersection-observer.directive';
import { ChipsComponent } from '../chips/chips.component';
import { Chip } from '../chips/chip.interface';
import { ActivatedRoute } from '@angular/router';
import { AutoFocusDirective } from '../shared/auto-focus.directive';
import { MasonryGridDirective } from '../shared/masonry-grid.directive';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClarityModule,
    TaxonComponent,
    ProjectCardComponent,
    UserCardComponent,
    PlaceCardComponent,
    IntersectionObserverDirective,
    ChipsComponent,
    AutoFocusDirective,
    MasonryGridDirective
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl: FormControl;
  sub!: SubscriptionLike;
  inat: InaturalistService;
  loading: boolean;
  searchResults!: Search[];
  observe: boolean;
  page: number;
  maxPage!: number;
  sources!: Chip[];

  constructor(private route:ActivatedRoute){
    this.searchControl = new FormControl('');
    this.inat = inject(InaturalistService);
    this.loading = false;
    this.observe = false;
    this.page = 1;
    this.searchResults = [];
    this.sources = [
      {label:'places',value:'place'},
      {label:'projects',value:'project'},
      {label:'taxa',value:'taxon'},
      {label:'users',value:'user'}
    ]
  }

  ngOnInit(): void {
    this.sub = this.searchControl.valueChanges.pipe(debounceTime(300)
    ).subscribe(this.initSearch.bind(this))
    let source = this.route.snapshot.params['source'];
    if(source){
      let s = this.sources.find(s=>s.value == source)
      if(s){ s.selected = true;}
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  initSearch(q:string){
    if(q){
      this.page = 1;
      this.searchResults.length = 0;
      this.observe = false;
      let sources = this.sources.filter(s=>s.selected).map(s=>s.label)
      console.log(sources)
      this.search(q,this.page,sources).finally(()=>{
        this.observe = true;
      })
    }
  }

  selectSource(c:Chip){
    console.log(this.sources);
    if(this.searchControl.value){
      this.initSearch(this.searchControl.value);
    }else if (this.searchResults.length){
      let types = this.sources.filter(s=>s.selected).map(s=>s.value)
      this.searchResults = this.searchResults.filter(s => types.includes(s.type))
    }
  }

  private async search(q:string,page:number,sources?:string[]):Promise<void>{
    this.loading = true;
    let res:ResultsSearch;

    try{
      res = await this.inat.search(q,sources,page)
    }catch{
      this.loading = false;
      throw 'err'
    }

    this.searchResults.push(...res.results)
    this.maxPage = Math.ceil(res.total_results/res.per_page)
    this.loading = false;
    this.page++;
  }

  intersected(){
    let q = this.searchControl.value;
    this.observe = false;
    if(this.maxPage >= this.page){
      let sources = this.sources.filter(s=>s.selected).map(s=>s.label)
      this.search(q,this.page,sources).then(()=>{
        this.observe = true;
      }).catch((e)=>{
        this.observe = false;
      })
    }
  }

}
