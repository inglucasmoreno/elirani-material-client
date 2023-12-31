import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {
  transform(fecha: any): string {
    if(fecha){
      return format(new Date(fecha), 'dd/MM/yyyy') === '01/01/1970' ? 'Sin especificar' : format(new Date(fecha), 'dd/MM/yyyy')
    }else{
      return '';
    }
  }
}
