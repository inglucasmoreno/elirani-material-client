import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'codigoMadera'
})
export class CodigoMaderaPipe implements PipeTransform {

  transform(value: string): string {
    return 'MA' + value;
  }

}
