import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClarityIcons, homeIcon, cogIcon, keyIcon } from '@cds/core/icon';
import { palmTreeIcon } from '@cds/core/icon/shapes/palm-tree';
import { ClarityModule } from '@clr/angular';
import { AuthorizationComponent } from './authorization/authorization.component'
import { filter } from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    HomeComponent,
    RouterModule,
    ClarityModule,
    AuthorizationComponent
  ]
})
export class AppComponent implements AfterViewChecked{
  title = 'natureGram';
  scrollVal:number[] = []
  @ViewChild('contentArea') contentArea!: ElementRef
  restoredScroll:number = 0;

  constructor(private router: Router){

    this.router.events.pipe(
      filter((e):e is NavigationStart => e instanceof NavigationStart)
    ).subscribe((e)=>{
        this.scrollVal.push(this.contentArea.nativeElement.scrollTop)
        if(e.navigationTrigger == 'popstate'){
          this.restoredScroll = this.scrollVal[(e.restoredState?.navigationId ?? 0) ];
        }
      })
  }

  ngAfterViewChecked(): void {
    if(this.restoredScroll){
      this.contentArea.nativeElement.scrollTo({top: this.restoredScroll })
      this.restoredScroll = 0
    }
  }
}

ClarityIcons.addIcons(palmTreeIcon,homeIcon,cogIcon,keyIcon)
