import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Taxon } from '../inaturalist/inaturalist.interface';

@Component({
  selector: 'app-taxon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taxon.component.html',
  styleUrls: ['./taxon.component.css']
})
export class TaxonComponent {
  @Input() taxon!: Taxon
  @Input() textOnly!: boolean;
}
