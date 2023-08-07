import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../inaturalist/inaturalist.interface';
import { UrlifyDirective } from '../shared/urlify.directive';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule,UrlifyDirective],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user!:User;

}
