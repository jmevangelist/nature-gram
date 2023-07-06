import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation, Vote, Identification, Comment } from '../inaturalist/inaturalist.interface';
import { DateTimeAgoPipe } from '../date-time-ago.pipe'
import { CarouselComponent } from '../carousel/carousel.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, starIcon, bookmarkIcon, chatBubbleIcon, infoStandardIcon, checkCircleIcon } from '@cds/core/icon';
import { InaturalistService } from '../inaturalist/inaturalist.service';
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
  isBookmarked: boolean = false;
  inatService: InaturalistService = inject(InaturalistService);
  authService: AuthorizationService = inject(AuthorizationService);
  authorized: boolean = false;
  faveBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  currentIdentification!: Identification | undefined;
  comment!: Comment | undefined;
  faveText: string = '';

  ngOnInit(){
    this.isFaved = Boolean(this.observation.faves.filter((f)=> f.user_id == this.authService.me?.id).length)
    if(this.observation.faves.length){
      this.faveText = `Faved by ${this.observation.faves[0].user?.login}`
      if(this.observation.faves.length == 2){
        this.faveText = `${this.faveText} and ${this.observation.faves[1].user?.login}`
      }else if(this.observation.faves.length > 2){
        this.faveText = `${this.faveText} and ${this.observation.faves_count-1} others`
      }
    }

    this.authorized = Boolean(this.authService.me)
    this.currentIdentification = this.observation.identifications
    .filter((i) => ((i.category=="leading"||i.category=='improving')&&i.current) )
    .sort((a,b) => ( Date.parse(a.created_at) - Date.parse(b.created_at) )  ).pop()
    this.observation.quality_grade = this.observation.quality_grade.replace('_',' ')
    if(this.observation.quality_grade == 'research'){
      this.observation.quality_grade+=' grade'
    }
    if(this.observation.comments?.length){
      this.comment = this.observation.comments?.pop()
    }
  }

  fave(){
    if(this.authorized){
      this.faveBtnState = ClrLoadingState.LOADING;
      this.inatService.fave(this.observation.uuid,!this.isFaved).then(()=>{
        if(this.isFaved){
          let k = this.observation.faves.findIndex((f)=> f.user_id == this.authService.me?.id)
          if( k >= 0 ){
            this.observation.faves?.splice(k,1)
            this.observation.faves_count--
          }
        }else{
          let tempVote: Vote = {id: 0, user_id: this.authService.me?.id || 0}
          this.observation.faves.push(tempVote)
          this.observation.faves_count++
        }
        this.isFaved = !this.isFaved;
      }).catch((e)=>{
        console.log(e)
      }).finally(()=>{
        this.faveBtnState = ClrLoadingState.DEFAULT;
      })
    }
  }

  bookmark(){
    this.isBookmarked = !this.isBookmarked
  }
}

ClarityIcons.addIcons(starIcon,bookmarkIcon,chatBubbleIcon,infoStandardIcon,checkCircleIcon)
