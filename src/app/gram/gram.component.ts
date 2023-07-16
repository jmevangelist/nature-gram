import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewContainerRef, createComponent, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observation, Vote, Identification, Comment } from '../inaturalist/inaturalist.interface';
import { DateTimeAgoPipe } from '../shared/date-time-ago.pipe'
import { CarouselComponent } from '../carousel/carousel.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, starIcon, bookmarkIcon, chatBubbleIcon, infoStandardIcon, checkCircleIcon } from '@cds/core/icon';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { AuthorizationService } from '../authorization/authorization.service';

@Component({
  selector: 'app-gram',
  standalone: true,
  imports: [
    CommonModule,
    DateTimeAgoPipe,
    CarouselComponent,
    RouterLink, 
    RouterOutlet,
    ClarityModule
  ],
  templateUrl: './gram.component.html',
  styleUrls: ['./gram.component.css'],
})
export class GramComponent implements OnInit {
  @Input() observation!: Observation;

  @ViewChildren('temp',{read: ViewContainerRef}) temp!: QueryList<ViewContainerRef>

  isFaved: boolean = false;
  isBookmarked: boolean = false;
  inatService: InaturalistService = inject(InaturalistService);
  authService: AuthorizationService = inject(AuthorizationService);
  authorized: boolean = false;
  faveBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  currentIdentification!: Identification | undefined;
  comment!: Comment;
  isCommentsOpen: boolean = false;

  ngOnInit(){
    this.isFaved = Boolean(this.observation.faves.filter((f)=> f.user_id == this.authService.me?.id).length)

    this.authorized = !this.authService.isExpired;
    this.currentIdentification = this.observation.identifications
    .filter((i) => ((i.category=="leading"||i.category=='improving')&&i.current) )
    .sort((a,b) => ( Date.parse(a.created_at) - Date.parse(b.created_at) )  ).pop()
    this.observation.quality_grade = this.observation.quality_grade.replace('_',' ')
    if(this.observation.quality_grade == 'research'){
      this.observation.quality_grade+=' grade'
    }
    if(this.observation.comments?.length){
      this.comment = this.observation.comments[0]
    }
  }

  faveText(){
    let text = ''
    if(this.observation.faves.length){
      text = `Faved by ${this.observation.faves[0].user?.login}`
      if(this.observation.faves.length == 2){
        text = `${text} and ${this.observation.faves[1].user?.login}`
      }else if(this.observation.faves.length > 2){
        text = `${text} and ${this.observation.faves_count-1} others`
      }
    }
    return text
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
          let tempVote: Vote = {id: 0, user_id: this.authService.me?.id || 0, user: {id:0, login:this.authService.me?.login}}
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

  async comments(){
    this.isCommentsOpen = true
    if (!this.temp.first.get(0)){
      const { CommentsComponent } = await import('../comments/comments.component');
      let commentsComponent = this.temp.first.createComponent(CommentsComponent);
      commentsComponent.instance.uuid = this.observation.uuid;
      commentsComponent.instance.comments = this.observation.comments;
      commentsComponent.instance.identifications = this.observation.identifications;
      
      commentsComponent.instance.auto = (window.innerWidth <= 768)  
    }
  }

  bookmark(){
    this.isBookmarked = !this.isBookmarked
  }
}

ClarityIcons.addIcons(starIcon,bookmarkIcon,chatBubbleIcon,infoStandardIcon,checkCircleIcon)
