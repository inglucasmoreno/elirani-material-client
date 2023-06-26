import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limiteCaracteres'
})
export class LimiteCaracteresPipe implements PipeTransform {

  transform(value: string, limite: number): string {
    console.log(value.length);
    return value.slice(0, limite) + (value.length > limite ? '...' : '');
  }

}
