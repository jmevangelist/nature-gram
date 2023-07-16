import { Pipe, PipeTransform } from '@angular/core'
import { Observable, interval,map, startWith } from 'rxjs'

@Pipe({name: 'dateTimeAgo',standalone:true})
export class DateTimeAgoPipe implements PipeTransform{
    transform(dateTimeString?: string, format?:string): Observable<string> {
        
        const timestamp = Date.parse(dateTimeString ?? '')
        let intervalMil = 60*1000*60

        if(Date.now() - timestamp < 1000*60 ){
            intervalMil = 5*1000
        }else if(Date.now() - timestamp < 1000*60*60){
            intervalMil = 60*1000
        }

        return interval(intervalMil).pipe(
            startWith(-1), 
            map( (x)=>{
                return convert(timestamp,format)
            })
        )
 
    }
}

function convert(timestamp:number, format?:string){

    if(!timestamp){
        return ''
    }
    
    const now = Date.now()
    let diff = Math.floor((now - timestamp)/1000)
    let unit = 'second'

    if(diff >= 60){
        unit = 'minute'
        diff = Math.floor(diff/60)
        if(diff >= 60){
            unit = 'hour'
            diff = Math.floor(diff/60)
            if(diff >= 24){
                unit = 'day'
                diff = Math.floor(diff/24)
                if(diff>=7){
                    unit = 'week'
                    diff = Math.floor(diff/7)
                    if(diff>=4){
                        unit = 'month'
                        diff = Math.floor(diff/4)
                        if(diff>=12){
                            unit = 'year'
                            diff = Math.floor(diff/12)
                        }
                    }
                }
            }
        }
    } else if (diff < 4) {
        return 'just now'
    }

    unit = unit + ( (diff > 1) ? 's' : '' )
    let datetimeAgoString = `${diff} ${unit} ago`
    if(format == 'short'){
        datetimeAgoString = `${diff}${unit}`
    }

    return datetimeAgoString
}