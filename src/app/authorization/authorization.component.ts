import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from './authorization.service';
import { inject } from '@angular/core';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { ClarityIcons, bugIcon, searchIcon, timesIcon } from '@cds/core/icon';
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
export class AuthorizationComponent {
  authService: AuthorizationService = inject(AuthorizationService)
  inatService: InaturalistService = inject(InaturalistService)
  authForm: FormGroup = new FormGroup({
    token: new FormControl('')    
  })

  me?: User;
  authBtnState: ClrLoadingState = ClrLoadingState.DEFAULT

  constructor(){
    console.log(this.authService.isExpired)
    this.authForm.controls['token'].setValue(this.authService.token)
    this.me = this.authService.me;
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

  
}

ClarityIcons.addIcons(timesIcon,bugIcon,searchIcon)