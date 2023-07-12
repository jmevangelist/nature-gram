import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, arrowIcon, bitcoinIcon } from '@cds/core/icon';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,ClarityModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() title!: string;
  @Input() shape!: string;
  @Output() onAction!: EventEmitter<boolean>;

  constructor(private location: Location){
    this.onAction = new EventEmitter<boolean>
  }

  ngOnInit(): void {
    if(!this.shape){
      this.shape = 'arrow'
    }
  }

  back():void{
    this.location.back()
  }

  action():void{
    if(this.shape == 'arrow'){
      this.back()
    }else{
      this.onAction.emit(true);
    }
  }
}

ClarityIcons.addIcons(arrowIcon)
fetch('/assets/icon.svg').then((res)=>{
  res.text().then((svg)=>{
    ClarityIcons.addIcons(['logo',svg])
  })
})
