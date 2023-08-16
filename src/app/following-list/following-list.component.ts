import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationService } from '../authorization/authorization.service';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { Relationship } from '../inaturalist/inaturalist.interface';
import { HeaderComponent } from '../header/header.component';
import { UrlifyDirective } from '../shared/urlify.directive';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-following-list',
  standalone: true,
  imports: [CommonModule,HeaderComponent,UrlifyDirective,UserCardComponent],
  templateUrl: './following-list.component.html',
  styleUrls: ['./following-list.component.css']
})
export class FollowingListComponent implements OnInit {

  auth: AuthorizationService;
  inat: InaturalistService;
  following!: Relationship[];
  loading: boolean;
  errorText!: string;

  constructor(){
    this.auth = inject(AuthorizationService);
    this.inat = inject(InaturalistService);
    this.loading = true;
  }

  ngOnInit(): void {
    if(!this.auth.isExpired){
      this.inat.getRelationships('').then((relationships:Relationship[])=>{
        this.following = relationships;
      }).catch(()=>{
        this.errorText = 'Missing/Expired token'
      }).finally(()=>{
        this.loading = false;
      })
    }else{
      this.loading = false;
    }
  }

}
