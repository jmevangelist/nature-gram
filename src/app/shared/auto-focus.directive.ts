import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private el:ElementRef) { }

  ngAfterViewInit(): void {
    this.el.nativeElement.focus();
  }

}
