import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
  standalone: true
})
export class IntersectionObserverDirective {

  @Output() intersected!: EventEmitter<void>;
  private observer!: IntersectionObserver;
  @Input() set observe(observe:boolean){
    if(observe){
      if(this.observer){
        this.start();
      }else{
        this.createObserver();
        this.start();
      }
    }else{
      this.stop();
    }
  }

  constructor(private el: ElementRef) { 
    this.intersected = new EventEmitter<void>;
  }

  createObserver():void{
    this.observer = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          this.intersected.emit()
        }
      })
    },{ rootMargin: '0px', threshold: 0.05 })
  }

  start():void{
    this.observer.observe(this.el.nativeElement)
  }

  stop():void{
    if(this.observer){
      this.observer.unobserve(this.el.nativeElement)
    }
  }

}
