import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, CommentsCreate, Identification } from '../inaturalist/inaturalist.interface';
import { RouterLink } from '@angular/router';
import { DateTimeAgoPipe } from '../date-time-ago.pipe';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, checkIcon } from '@cds/core/icon';
import { AuthorizationService } from '../authorization/authorization.service';
import { FormsModule } from '@angular/forms';
import { InaturalistService } from '../inaturalist/inaturalist.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DateTimeAgoPipe,
    ClarityModule,
    FormsModule
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

  constructor(){
    this.authServ = inject(AuthorizationService);
    this.inatServ = inject(InaturalistService);
    this.newComment = ''
  }

  ngOnInit(): void {
    this.combination = this.comments.concat(...this.identifications)
    .sort((a,b)=> Date.parse(a.created_at) - Date.parse(b.created_at))
    console.log(this.combination)
  }


  onSubmit(){
    if(this.newComment){
      console.log(this.newComment)
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
      })
    }

  }

}

ClarityIcons.addIcons(checkIcon)