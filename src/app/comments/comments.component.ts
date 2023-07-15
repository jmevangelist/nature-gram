import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, CommentsCreate, Identification, IdentificationsCreate, Taxon } from '../inaturalist/inaturalist.interface';
import { RouterLink } from '@angular/router';
import { DateTimeAgoPipe } from '../shared/date-time-ago.pipe';
import { ClarityModule, ClrLoadingButton, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, checkIcon } from '@cds/core/icon';
import { AuthorizationService } from '../authorization/authorization.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { TaxonComponent } from '../taxon/taxon.component';
import { BehaviorSubject, Observable, SubscriptionLike, debounceTime, delay, from } from 'rxjs';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DateTimeAgoPipe,
    ClarityModule,
    ReactiveFormsModule,
    FormsModule,
    TaxonComponent
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() comments!: Comment[];
  @Input() identifications!: Identification[];
  @Input() uuid!: string;

  combination!: any[]
  authServ: AuthorizationService;
  inatServ: InaturalistService;
  newComment: string;
  submitBtnState: ClrLoadingState;
  identBtnState: ClrLoadingState;
  loading: boolean;
  openIdentification: boolean;
  suggestions: any[];
  computerVision: any[];
  qTaxon: FormControl;
  isIdentifying: boolean;
  sub: SubscriptionLike;
  id: IdentificationsCreate | undefined;
  selectedTaxon: Taxon | undefined;

  @ViewChildren('activity') activity!: QueryList<any>

  constructor(private changeDetectRef: ChangeDetectorRef){
    this.authServ = inject(AuthorizationService);
    this.inatServ = inject(InaturalistService);
    this.newComment = ''
    this.submitBtnState = ClrLoadingState.DEFAULT;
    this.identBtnState = ClrLoadingState.DEFAULT;
    this.loading = true;
    this.combination = [];
    this.openIdentification = false;
    this.suggestions = []
    this.isIdentifying = false;
    this.computerVision = [];
    this.qTaxon = new FormControl('')

    this.sub = from(this.qTaxon.valueChanges).pipe(
      debounceTime(300)
    ).subscribe(this.searchTaxa.bind(this))
  }

  ngOnInit(): void {    

    setTimeout(() => {
      this.combination = this.comments.concat(...this.identifications)
      .sort((a,b)=> Date.parse(a.created_at) - Date.parse(b.created_at))
  
      if(this.combination.length == 0){
        this.loading = false
      }
    })
  }

  ngAfterViewInit(): void {
    let sub = this.activity.changes.subscribe((a)=>{
      this.loading = false;
      sub.unsubscribe;
      this.changeDetectRef.detectChanges();

    }) 
  }

  trackByItems(index: number, c: any): number { return c.uuid ?? c.id; }

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

  identify(taxon:Taxon):void{
    this.id = {
      identification: { taxon_id: taxon.id, observation_id: this.uuid }
    }
    this.selectedTaxon = taxon;
  }

  onSubmit(){  
    if(this.newComment && !this.id){
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
    }else if(this.id){
      this.submitBtnState = ClrLoadingState.LOADING
      this.id.identification.body = this.newComment;
      this.inatServ.identification(this.id).then((identifications:Identification[])=>{
        this.combination.push(...identifications)
      }).finally(()=>{
        this.qTaxon.reset();
        this.suggestions = [];
        this.newComment = ''
        this.submitBtnState = ClrLoadingState.DEFAULT;
        this.id = undefined;
        this.selectedTaxon = undefined;
      })
    }
    this.isIdentifying = false;
  }


  getSuggestions(){
    this.identBtnState = ClrLoadingState.LOADING;
    if(!this.computerVision.length){
      this.inatServ.getComputerVisionOnObs(this.uuid).then( (suggestions:any[]) => {
        this.suggestions = suggestions;
        this.computerVision = suggestions;
        console.log(this.suggestions)
      }).finally(()=>{
        this.identBtnState = ClrLoadingState.DEFAULT;
      })
    }else{
      this.suggestions = this.computerVision;
      this.identBtnState = ClrLoadingState.DEFAULT;
    }
  }

  searchTaxa(q:string){
    if(q){
      this.identBtnState = ClrLoadingState.LOADING;
      this.inatServ.taxaAutoComplete(q).then((res:Taxon[])=>{
        this.suggestions = res.map( (r) => { 
          return {  combined_score: 0 ,
                    taxon: r
                }
        })
        console.log(this.suggestions)
        if(res.length == 0){
          this.qTaxon.setErrors({'invalid':'No matching taxon found'})
          this.suggestions = []
        }
      }).catch((e)=>{
        this.suggestions = []
        this.qTaxon.setErrors({'invalid':e})
      }).finally(()=>{
        this.identBtnState = ClrLoadingState.DEFAULT;
      })
    }else{
      this.suggestions = this.computerVision;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}

ClarityIcons.addIcons(checkIcon)