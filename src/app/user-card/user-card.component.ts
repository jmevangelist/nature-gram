import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../inaturalist/inaturalist.interface';
import { UrlifyDirective } from '../shared/urlify.directive';
import { IntWordPipe } from '../shared/int-word.pipe';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule,UrlifyDirective,IntWordPipe],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user!:User;

}
