import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonStrings'
})
export class JsonStringsPipe implements PipeTransform {

  transform(value: object): string {
    let jsonstr = JSON.stringify(value);
    return jsonstr;
  }

}
