import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation } from '../inaturalist/inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { HeaderComponent } from '../header/header.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { TaxonComponent } from '../taxon/taxon.component';
import { CommentsComponent } from '../comments/comments.component';
import { ClarityModule, ClrLoadingButton, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, mapMarkerIcon } from '@cds/core/icon';
import { AuthorizationService } from '../authorization/authorization.service';
import { UrlifyDirective } from '../shared/urlify.directive';
import { MapComponent } from '../map/map.component';
import { QualityMetricComponent } from '../quality-metric/quality-metric.component';
import { AlbumComponent } from '../album/album.component';
import { IntWordPipe } from '../shared/int-word.pipe';

@Component({
  selector: 'app-observation',
  standalone: true,
  imports: [
    CommonModule,
    GramComponent,
    HeaderComponent,
    CarouselComponent,
    TaxonComponent,
    CommentsComponent,
    ClarityModule,
    UrlifyDirective,
    MapComponent,
    QualityMetricComponent,
    AlbumComponent,
    IntWordPipe
  ],
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  inaturalistService: InaturalistService = inject(InaturalistService)
  authService: AuthorizationService = inject(AuthorizationService)

  uuid: string;
  observation!: Observation | undefined;
  taxonSummary: any;


  constructor(private location:Location){
    this.uuid = this.route.snapshot.params['uuid'];
    let url = this.location.prepareExternalUrl('/assets/')
    fetch(`${url}share.svg`).then((res)=>{
      res.text().then((svg)=>{
        ClarityIcons.addIcons(['share',svg])
      })
    })
    ClarityIcons.addIcons(mapMarkerIcon)
  }

  ngOnInit(): void {
    this.inaturalistService.getObservationsByUUID([this.uuid]).then((obs:Observation[])=>{
        this.observation = obs.pop();
        if(this.observation?.quality_grade == 'research'){
          this.observation.quality_grade = 'research grade'
        }
    })
    this.inaturalistService.getObservationTaxonSummaryByUUID(this.uuid).then((data:any)=>{
      this.taxonSummary = data;
      
    })
  }

  fave(b:ClrLoadingButton):void{
    if(this.observation){
      b.loadingStateChange(ClrLoadingState.LOADING)
      let toFave = !this.isFaved();
      this.inaturalistService.fave(this.observation?.uuid,toFave).then((s:boolean)=>{
        if(toFave && this.observation){
          this.observation.faves.push({id: 0, user_id: this.authService.me?.id ?? 0})
          this.observation.faves_count++
        }else{
          let index = this.observation?.faves.findIndex((f)=> f.user_id == this.authService.me?.id) ?? -1
          if(index >= 0 && this.observation){
            this.observation.faves.splice(index,1)
            this.observation.faves_count--
          }
        }
      }).finally(()=>{
        b.loadingStateChange(ClrLoadingState.DEFAULT)
      })

    }
  }

  isFaved():boolean{
    return Boolean(this.observation?.faves.find((f)=> f.user_id == this.authService.me?.id ))
  }

  share(){
    let shareData = {title:'Observation',text:'',url:this.observation?.uri}
    if (navigator.canShare(shareData)){
      navigator.share(shareData);
    }
  }

}

