import { Pipe, PipeTransform } from '@angular/core';
import { Global } from '../_global/global';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value){
      return '';
    }
    let val = Math.floor(value);
    if(isNaN(val)){
      return '';
    }else{
      return '';
    }
  
  }

}
