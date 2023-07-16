import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Observation } from '../inaturalist/inaturalist.interface';
import { GramComponent } from '../gram/gram.component';
import { HeaderComponent } from '../header/header.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { TaxonComponent } from '../taxon/taxon.component';
import { CommentsComponent } from '../comments/comments.component';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, mapMarkerIcon } from '@cds/core/icon';
import { AuthorizationService } from '../authorization/authorization.service';

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
    ClarityModule
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

  constructor(){
    this.uuid = this.route.snapshot.params['uuid'];
  }

  ngOnInit(): void {
    this.inaturalistService.getObservationsByUUID([this.uuid]).then((obs:Observation[])=>{
        this.observation = obs.pop();
        console.log(this.observation)
        if(this.observation?.quality_grade == 'research'){
          this.observation.quality_grade = 'research grade'
        }
    })
  }

  fave():void{
    if(this.observation){
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

      })

    }
  }

  isFaved():boolean{
    return Boolean(this.observation?.faves.find((f)=> f.user_id == this.authService.me?.id ))
  }

}

ClarityIcons.addIcons(mapMarkerIcon)