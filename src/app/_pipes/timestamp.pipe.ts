import { Pipe, PipeTransform } from '@angular/core';
import { Global } from '../_global/global';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    
    if(!value){
      return '';
    }
    let val = Math.round(value);
    if(isNaN(val)){
      return ''
    }else{
      if(args==='hh:mm:ss'){
        return Global.getTimeStamp(val);
      }
      if(args==='mm:ss'){
        return Global.getMMSS(val);
      }
      if(args==='m/d/y'){
        return Global.formatDateToLocal(val);
      }
      if(args==='h:m:s'){
        return Global.formatAMPM(val);
      }
      
    }
  }

}
