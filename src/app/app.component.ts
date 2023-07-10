import { AfterViewChecked, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClarityIcons, homeIcon, cogIcon, keyIcon, searchIcon, imageGalleryIcon, briefcaseIcon } from '@cds/core/icon';
import { palmTreeIcon } from '@cds/core/icon/shapes/palm-tree';
import { ClarityModule } from '@clr/angular';
import { AuthorizationService } from './authorization/authorization.service';
import { filter } from 'rxjs'


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    HomeComponent,
    RouterModule,
    ClarityModule
  ]
})
export class AppComponent implements AfterViewChecked{
  title = 'natureGram';
  scrollVal:number[] = []
  @ViewChild('contentArea') contentArea!: ElementRef
  restoredScroll:number = 0;
  authServ:AuthorizationService = inject(AuthorizationService);

  constructor(private router: Router){
    this.router.events.pipe(
      filter((e):e is NavigationStart => e instanceof NavigationStart)
    ).subscribe(this.onNavigationStart.bind(this))
  }

  onNavigationStart(e:NavigationStart){
    this.scrollVal.push(this.contentArea.nativeElement.scrollTop)
    if(e.navigationTrigger == 'popstate'){
      this.restoredScroll = this.scrollVal[(e.restoredState?.navigationId ?? 0) ];
    }
  }

  ngAfterViewChecked(): void {
    if(this.restoredScroll){
      this.contentArea.nativeElement.scrollTo({top: this.restoredScroll })
      this.restoredScroll = 0
    }
  }
}


fetch('/assets/logo.svg').then((res)=>{
  res.text().then((svg)=>{
    ClarityIcons.addIcons(['brand',svg])
  })
})


ClarityIcons.addIcons(palmTreeIcon,homeIcon,cogIcon,keyIcon,searchIcon,briefcaseIcon,imageGalleryIcon)
