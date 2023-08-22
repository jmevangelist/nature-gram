import { AfterViewChecked, AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { NavigationStart, RouteReuseStrategy, Router, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClarityIcons, homeIcon, cogIcon, keyIcon, searchIcon, imageGalleryIcon, briefcaseIcon } from '@cds/core/icon';
import { palmTreeIcon } from '@cds/core/icon/shapes/palm-tree';
import { ClarityModule } from '@clr/angular';
import { AuthorizationService } from './authorization/authorization.service';
import { filter } from 'rxjs'
import { CommonModule, Location } from '@angular/common';
import { NotificationService } from './notification/notification.service';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { bootstrapApplication } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    HomeComponent,
    RouterModule,
    ClarityModule,
    CommonModule,
  ]
})

export class AppComponent implements AfterViewChecked, AfterViewInit{
  title = 'natureGram';
  scrollVal:number[] = []
  @ViewChild('contentArea') contentArea!: ElementRef
  restoredScroll:number = 0;
  authServ:AuthorizationService = inject(AuthorizationService);
  notification:NotificationService = inject(NotificationService);
  collapsed: boolean = false;

  constructor(private router: Router, private location: Location, private changeRef: ChangeDetectorRef){
    this.router.events.pipe(
      filter((e):e is NavigationStart => e instanceof NavigationStart)
    ).subscribe(this.onNavigationStart.bind(this))
    this.notification.notification$.subscribe((n)=>{
      console.log(`notifications: ${n}`)
    })
    let url = this.location.prepareExternalUrl('/assets/')
    fetch(`${url}binoculars-outline.svg`).then((res)=>{
      res.text().then((svg)=>{
        ClarityIcons.addIcons(['binoculars',svg])
      })
    })
    ClarityIcons.addIcons(palmTreeIcon,homeIcon,cogIcon,keyIcon,searchIcon,briefcaseIcon,imageGalleryIcon)
  }

  onNavigationStart(e:NavigationStart){
    // this.scrollVal.push(this.contentArea.nativeElement.scrollTop)
    // if(e.navigationTrigger == 'popstate'){
    //   this.restoredScroll = this.scrollVal[(e.restoredState?.navigationId ?? 0) ];
    // }
  }

  ngAfterViewInit(): void {
    if(window.innerWidth < 900 ){
      this.collapsed = true;
    }else{
      this.collapsed = false;
    }
    this.changeRef.detectChanges();
  }

  ngAfterViewChecked(): void {
    // if(this.restoredScroll){
    //   this.contentArea.nativeElement.scrollTo({top: this.restoredScroll })
    //   this.restoredScroll = 0
    // }
  }

  @HostListener('window:resize',['$event'])
  onResize(event:any){
    if(event.target.innerWidth < 900 ){
      this.collapsed = true;
    }else{
      this.collapsed = false;
    }
  }
}

