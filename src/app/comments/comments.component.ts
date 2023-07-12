import { Component, ElementRef, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, CommentsCreate, Identification, IdentificationsCreate, Taxon } from '../inaturalist/inaturalist.interface';
import { RouterLink } from '@angular/router';
import { DateTimeAgoPipe } from '../shared/date-time-ago.pipe';
import { ClarityModule, ClrLoadingButton, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, checkIcon } from '@cds/core/icon';
import { AuthorizationService } from '../authorization/authorization.service';
import { FormsModule } from '@angular/forms';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { TaxonComponent } from '../taxon/taxon.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DateTimeAgoPipe,
    ClarityModule,
    FormsModule,
    TaxonComponent
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() comments!: Comment[];
  @Input() identifications!: Identification[];
  @Input() uuid!: string;
  combination!: any[]
  authServ: AuthorizationService;
  inatServ: InaturalistService;
  newComment: string;
  submitBtnState: ClrLoadingState;
  identBtnState: ClrLoadingState;

  constructor(){
    this.authServ = inject(AuthorizationService);
    this.inatServ = inject(InaturalistService);
    this.newComment = ''
    this.submitBtnState = ClrLoadingState.DEFAULT;
    this.identBtnState = ClrLoadingState.DEFAULT;
  }

  ngOnInit(): void {
    this.combination = this.comments.concat(...this.identifications)
    .sort((a,b)=> Date.parse(a.created_at) - Date.parse(b.created_at))
  }

  agree(taxon:Taxon,ref:ClrLoadingButton): void {
    ref.loadingStateChange(ClrLoadingState.LOADING)
    let identification: IdentificationsCreate = {
      identification: { taxon_id: taxon.id, observation_id: this.uuid }
    }
    this.inatServ.identification(identification).then((identifications:Identification[])=>{
      this.combination.push(...identifications)
    }).finally(()=>{
      ref.loadingStateChange(ClrLoadingState.DEFAULT) 
    })
  }

  onSubmit(){
    if(this.newComment){
      this.submitBtnState = ClrLoadingState.LOADING
      let comment: CommentsCreate = {
        fields: 'string',
        comment: {
          parent_type: 'Observation',
          parent_id: this.uuid,
          body: this.newComment
        }
      }
      this.inatServ.comment(comment).then((comments:Comment[])=>{
        this.combination.push(...comments)  
      }).finally(()=>{
        this.newComment = ''
        this.submitBtnState = ClrLoadingState.DEFAULT;
      })
    }

  }

}

ClarityIcons.addIcons(checkIcon)