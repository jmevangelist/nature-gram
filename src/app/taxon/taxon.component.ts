import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Taxon } from '../inaturalist/inaturalist.interface';
import { UrlifyDirective } from '../shared/urlify.directive';

@Component({
  selector: 'app-taxon',
  standalone: true,
  imports: [CommonModule,UrlifyDirective],
  templateUrl: './taxon.component.html',
  styleUrls: ['./taxon.component.css']
})
export class TaxonComponent {
  @Input() taxon!: Taxon
  @Input() textOnly!: boolean;
}
