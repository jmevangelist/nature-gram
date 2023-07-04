import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation, Vote, Identification } from '../inaturalist.interface';
import { DateTimeAgoPipe } from '../date-time-ago.pipe'
import { CarouselComponent } from '../carousel/carousel.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, starIcon, bellIcon } from '@cds/core/icon';
import { InaturalistService } from '../inaturalist.service';
import { AuthorizationService } from '../authorization/authorization.service';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-gram',
  standalone: true,
  imports: [
    CommonModule,
    DateTimeAgoPipe,
    CarouselComponent,
    RouterLink, 
    RouterOutlet,
    ClarityModule,
  ],
  templateUrl: './gram.component.html',
  styleUrls: ['./gram.component.css'],
})
export class GramComponent implements OnInit {
  @Input() observation!: Observation;
  isFaved: boolean = false;
  inatService: InaturalistService = inject(InaturalistService);
  authService: AuthorizationService = inject(AuthorizationService);
  homeService: HomeService = inject(HomeService);
  authorized: boolean = false;
  faveBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  currentIdentification!: Identification | undefined;

  ngOnInit(){
    this.isFaved = Boolean(this.observation.faves.filter((f)=> f.user_id == this.authService.me?.id).length)
    this.authorized = Boolean(this.authService.me)
    this.currentIdentification = this.observation.identifications
    .filter((i) => ((i.category=="leading"||i.category=='improving')&&i.current) )
    .sort((a,b) => ( Date.parse(a.created_at) - Date.parse(b.created_at) )  ).pop()
    this.observation.quality_grade = this.observation.quality_grade.replace('_',' ')
    if(this.observation.quality_grade == 'research'){
      this.observation.quality_grade+=' grade'
    }
  }

  fave(){
    if(this.authorized){
      this.faveBtnState = ClrLoadingState.LOADING;
      this.inatService.fave(this.observation.uuid,!this.isFaved).then(()=>{
        let i = this.homeService.Observations.findIndex((o)=> o.id == this.observation.id )
        if(this.isFaved){
          let k = this.homeService.Observations[i].faves.findIndex((f)=> f.user_id == this.authService.me?.id)
          if(k || k==0){
            this.homeService.Observations[i].faves?.splice(k,1)
            this.homeService.Observations[i].faves_count--
          }
        }else{
          if(this.homeService.Observations[i].faves){
            let tempVote: Vote = {id: 0, user_id: this.authService.me?.id || 0}
            this.homeService.Observations[i].faves.push(tempVote)
            this.homeService.Observations[i].faves_count++
          }
        }
        this.isFaved = !this.isFaved;
      }).catch((e)=>{
        console.log(e)
      }).finally(()=>{
        this.faveBtnState = ClrLoadingState.DEFAULT;
      })
    }
  }
}

ClarityIcons.addIcons(starIcon,bellIcon)
