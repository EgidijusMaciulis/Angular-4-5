import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    let finalResult = '';

    for (let i = value.length - 1; i >= 0; i--) {
      finalResult += value[i];
    }

    return finalResult;
  }
}
