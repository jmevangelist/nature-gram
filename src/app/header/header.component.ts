import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, arrowIcon } from '@cds/core/icon';
import { IconShapeTuple } from '@cds/core/icon/interfaces/icon.interfaces';


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
  @Input() secondaryShape!: IconShapeTuple;
  @Input() badge!: 'info' | 'success' | 'warning' | 'danger' | 'inherit' | 'warning' | ''
  @Output() onAction!: EventEmitter<boolean>;
  @Output() onSecondaryAction!: EventEmitter<boolean>;

  constructor(private location: Location){
    this.onAction = new EventEmitter<boolean>
    this.onSecondaryAction = new EventEmitter<boolean>
  }

  ngOnInit(): void {
    if(!this.shape){
      this.shape = 'arrow'
      ClarityIcons.addIcons(arrowIcon)
    }else if(this.shape == 'logo'){
      let url = this.location.prepareExternalUrl('/assets/icon.svg')
      fetch(url).then((res)=>{
        res.text().then((svg)=>{
          ClarityIcons.addIcons(['logo',svg])
        })
      })
    }
    if(this.secondaryShape){
      ClarityIcons.addIcons(this.secondaryShape)
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

  secondaryaction():void{
    this.onSecondaryAction.emit(true);
  }
}





