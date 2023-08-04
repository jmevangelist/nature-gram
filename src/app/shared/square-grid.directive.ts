import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[squareGrid]',
  standalone: true
})
export class SquareGridDirective implements AfterViewInit {

  constructor(private el:ElementRef) { 
  }

  ngAfterViewInit(): void {
    let c = getComputedStyle(this.el.nativeElement).getPropertyValue('grid-template-columns')
    let rowHeight = c.split(' ').at(0);
    this.el.nativeElement.style['grid-auto-rows'] = rowHeight;
  }

}
