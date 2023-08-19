import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Photo, Taxon } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { AlbumComponent } from '../album/album.component';
import { UrlifyDirective } from '../shared/urlify.directive';
import { TaxonComponent } from '../taxon/taxon.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { MapComponent } from '../map/map.component';
import { SubscriptionLike } from 'rxjs';
import { ObservationGridComponent } from '../observation-grid/observation-grid.component';

@Component({
  selector: 'app-taxon-info',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AlbumComponent,
    UrlifyDirective,
    TaxonComponent,
    CarouselComponent,
    MapComponent,
    ObservationGridComponent
  ],
  templateUrl: './taxon-info.component.html',
  styleUrls: ['./taxon-info.component.css']
})
export class TaxonInfoComponent implements OnInit, OnDestroy {
  id!: number;
  route: ActivatedRoute = inject(ActivatedRoute);
  inat: InaturalistService = inject(InaturalistService);
  taxon!: Taxon | undefined;
  photos!: Photo[]; 
  wiki!: string | undefined;
  sub!: SubscriptionLike;

  constructor(){
    this.id = this.route.snapshot.params['id']; 
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getTaxa();
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getTaxa(){
    this.taxon = undefined;
    this.wiki = undefined;
    this.photos = [];
    this.inat.getTaxa([this.id.toString()],'all').then((taxa:Taxon[])=>{
      if(taxa.length){
        this.taxon = taxa[0];
        console.log(this.taxon)
        let photos = this.taxon.taxon_photos?.map((tp)=>tp.photo) ?? [];
        photos.forEach((p)=>{
          p.url = p.url.replace('square','original')
        })
        this.photos = photos;
        this.wikipediaSummary(this.taxon?.wikipedia_url)
      }
    })
  }

  taxonomy(){
    this.taxon?.children
  }

  wikipediaSummary(uri?:string):void{
    let title = uri?.substring(uri.lastIndexOf('/')+1)
    if(title){
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}?redirect=true`
      ).then(res=>{
        if(res.ok){
          res.json().then((data:any)=>{
            console.log(data)
            this.wiki = data.extract_html.replace('<p>','').replace('</p>','');
          })
        }

      })
    }
  }
}
