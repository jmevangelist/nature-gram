import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intWord',
  standalone: true
})
export class IntWordPipe implements PipeTransform {

  private numWords = [
    {div:1000,word:' thousand',short:'K'},
    {div:1000000,word:' million',short:'M'},
    {div:1000000000,word:' billion',short:'B'}
  ]

  transform(n: number|undefined, format?:string): string {
    if(n===undefined){return ''}
    if(!format){format = 'short'}
    let word = ''

    if(n<1000){
      word = n.toString();
    }else{
      let i = -1;
      let r = 0;
      for(i=0;i<3;i++){
        r = Math.floor(n/this.numWords[i].div)
        if(r<1000){
          break;
        }
      }
      word = `${r}${format=='long' ? this.numWords[i].word : this.numWords[i].short }`
    }

    return word

  }

}
