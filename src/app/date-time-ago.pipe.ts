import { Pipe, PipeTransform } from '@angular/core'
import { Observable, interval,map, startWith } from 'rxjs'

@Pipe({name: 'dateTimeAgo',standalone:true})
export class DateTimeAgoPipe implements PipeTransform{
    transform(dateTimeString: string, format?:string): Observable<string> {

        return interval(60*1000).pipe(
            startWith(-1), 
            map( (x)=>{
                return convert(dateTimeString,format)
            })
        )
 
    }
}

function convert(dateTimeString:string, format?:string){
    if(!dateTimeString){
        return ''
    }

    const timestamp = Date.parse(dateTimeString)
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
    } else {
        return 'just now'
    }

    unit = unit + ( (diff > 1) ? 's' : '' )
    let datetimeAgoString = `${diff} ${unit} ago`
    if(format == 'short'){
        datetimeAgoString = `${diff}${unit.charAt(0)}`
    }

    return datetimeAgoString
}