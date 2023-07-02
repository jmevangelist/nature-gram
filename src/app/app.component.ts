import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClarityIcons, homeIcon, cogIcon, keyIcon } from '@cds/core/icon';
import { palmTreeIcon } from '@cds/core/icon/shapes/palm-tree';
import { ClarityModule } from '@clr/angular';
import { AuthorizationComponent } from './authorization/authorization.component'

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
export class AppComponent {
  title = 'natureGram';
  authorize: boolean = false;
}

ClarityIcons.addIcons(palmTreeIcon,homeIcon,cogIcon,keyIcon)
