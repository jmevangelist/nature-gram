import { Component, EventEmitter, Input, NgZoneOptions, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { Chip } from './chip.interface';

@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [ 
    CommonModule,
    RouterLink,
    ClarityModule ],
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})
export class ChipsComponent implements OnInit {
  @Input() chips!: Chip[];
  @Output() chipSelect: EventEmitter<Chip>;

  private last!: any;

  constructor(){
    this.chipSelect = new EventEmitter<Chip>();
  }

  ngOnInit(): void {
    this.last = this.chips.find(c => c.selected)
  }

  selectChip(chip:Chip,value?:string){
    if(this.last){ this.last.selected = false }
    chip.option = value;
    chip.selected = true;
    this.chipSelect.emit(chip)
    this.last = chip
  }

}
