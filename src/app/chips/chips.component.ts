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
  @Input() multiSelect: boolean = false;

  @Input() set selected(sel:string|null){
    if(sel){
      if(!this.multiSelect){      
        this.chips.forEach(c=>c.selected = false)
      }
      let chip = this.chips.find(c=>c.label.toLocaleLowerCase() == sel.toLocaleLowerCase())
      if(chip){ chip.selected = true}
    }
  }

  private last!: Chip | undefined;

  constructor(){
    this.chipSelect = new EventEmitter<Chip>();
  }

  ngOnInit(): void {
    if(!this.multiSelect){
      this.last = this.chips.find(c => c.selected)
    }
  }

  selectChip(chip:Chip,value?:string){
    if(!this.multiSelect && this.last){ 
      this.last.selected = false 
    };
    
    if(chip.options){
      chip.option = value;
    }
    
    if(this.multiSelect && !value){
      chip.selected = !chip.selected;
    }else{
      chip.selected = true;
    }

    this.chipSelect.emit(chip)
    this.last = chip
  }

}
