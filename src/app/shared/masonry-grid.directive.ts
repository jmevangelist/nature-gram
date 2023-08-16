import { AfterViewChecked, AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[masonryGrid]',
  standalone: true
})
export class MasonryGridDirective implements AfterViewInit, AfterViewChecked {

  private isMasonrySupported!: boolean;
  private gridItems!:HTMLElement[];
  private gap!:number;
  private ncol!:number;
  
  constructor(private el:ElementRef) { 
    this.gridItems = []
  }

  ngAfterViewInit(): void {
    if(getComputedStyle(this.el.nativeElement).gridTemplateRows !== 'masonry') {
      console.log('masonry not supported')
      this.isMasonrySupported = false;
    }else{
      console.log('masonry is supported')
      this.isMasonrySupported = true;
    }

  }

  ngAfterViewChecked(): void {
    if(!this.isMasonrySupported && this.el.nativeElement.childNodes.length > 1){
      this.gap = parseFloat(getComputedStyle(this.el.nativeElement).rowGap);
      this.ncol = getComputedStyle(this.el.nativeElement).gridTemplateColumns.split(' ').length;

      let childNodes = this.el.nativeElement.childNodes;
      let gridItems:HTMLElement[] = [];
      childNodes.forEach( (node:HTMLElement) => {
        if(node.nodeType===1){
          gridItems.push(node)
        }
      });

      if((gridItems !== this.gridItems) && (this.ncol > 1)){
        this.gridItems = gridItems;
        this.layout();
      }

    }
  }

  layout(): void{
    this.gridItems.forEach( (item:HTMLElement) => {
      item.style.removeProperty('margin-top');
    })

    this.gridItems.slice(this.ncol).forEach((c,i)=>{
      let prev_fin = this.gridItems[i].firstElementChild?.getBoundingClientRect().bottom ?? 0 /* bottom edge of item above */
      let curr_ini = c.getBoundingClientRect().top /* top edge of current item */;
      c.style.marginTop = `${prev_fin - curr_ini + this.gap}px`
    })

  }



}
