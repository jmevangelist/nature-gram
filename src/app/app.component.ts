import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClarityIcons } from '@cds/core/icon';
import { palmTreeIcon } from '@cds/core/icon/shapes/palm-tree';
import { ClarityModule } from '@clr/angular';


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
export class AppComponent {
  title = 'natureGram';
}

ClarityIcons.addIcons(['my-icon','<svg src="assets/logo.svg"></svg>'])
ClarityIcons.addIcons(palmTreeIcon)
