import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from './authorization.service';
import { inject } from '@angular/core';
import { ClarityModule, ClrLoadingState } from '@clr/angular';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../inaturalist.interface';
import { InaturalistService } from '../inaturalist.service';

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
      this.inatService.getMe(this.authForm.value.token).then((user:User|undefined)=>{
        if(user){ 
          this.me = user;
          this.authService.setMe(user); 
          this.authService.setToken(this.authForm.value.token)
          this.authBtnState = ClrLoadingState.DEFAULT;
        }else{
          this.authBtnState = ClrLoadingState.ERROR;
          this.authForm.controls['token'].setErrors({'invalid':true})
        }
      }).catch((e)=>{
        this.authForm.controls['token'].setErrors({'invalid':true})
        this.authBtnState = ClrLoadingState.ERROR;
      }).finally(()=>{
        
      })
    }
  }
  
}
