import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from './authorization.service';
import { inject } from '@angular/core';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, timesIcon } from '@cds/core/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Taxon, User } from '../inaturalist/inaturalist.interface';
import { InaturalistService } from '../inaturalist/inaturalist.service';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    ReactiveFormsModule
  ],
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnDestroy {
  authService: AuthorizationService = inject(AuthorizationService)
  inatService: InaturalistService = inject(InaturalistService)
  authForm: FormGroup = new FormGroup({
    token: new FormControl('')    
  })

  taxaControl:FormControl = new FormControl('')
  taxa:Taxon[];
  taxaBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  prefForm: FormGroup = new FormGroup({
    taxaControl: this.taxaControl
  })

  me?: User;
  authBtnState: ClrLoadingState = ClrLoadingState.DEFAULT

  constructor(){
    this.authForm.controls['token'].setValue(this.authService.token)
    this.me = this.authService.me;
    this.taxa = this.authService.taxa ?? [];
    this.taxaControl.valueChanges.subscribe(this.taxaChange)
  }

  auth(){
    this.authBtnState = ClrLoadingState.LOADING;
    if(this.me){
      this.me = undefined;
      this.authForm.reset();
      this.authService.logout();
      this.authBtnState = ClrLoadingState.DEFAULT;
    }else{
      this.authService.auth(this.authForm.value.token).then((s)=>{
        if(s){
          this.me = this.authService.me;
        }else{
          this.authForm.controls['token'].setErrors({'invalid':true})
          this.authBtnState = ClrLoadingState.ERROR;
        }
      }).finally(()=>{
        this.authBtnState = ClrLoadingState.DEFAULT;
      })
    }
  }

  addTaxa(event:Event){
    event.preventDefault();

    this.taxaBtnState = ClrLoadingState.LOADING;
    console.log(this.taxaControl.value)
    this.inatService.taxaAutoComplete(this.taxaControl.value)
    .then((taxon:Taxon|undefined)=>{
      if(taxon){
        this.taxa.push(taxon)
        this.taxaControl.reset()
      }else{
        this.taxaControl.setErrors({'invalid':true})
      }
    }).finally(()=>{
      this.taxaBtnState = ClrLoadingState.DEFAULT;
    })
  }

  removeTaxa(taxon:Taxon){
    let i = this.taxa.findIndex(t=> t.id == taxon.id)
    this.taxa.splice(i,1)
  }

  taxaChange(v:string){
    // console.log(v)
  }

  ngOnDestroy(){
    this.authService.updateTaxa(this.taxa)
  }
  
}

ClarityIcons.addIcons(timesIcon)