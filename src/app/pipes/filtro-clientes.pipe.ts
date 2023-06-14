import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroClientes'
})
export class FiltroClientesPipe implements PipeTransform {

  transform(valores: any[], parametro: string, activo: string): any {
    
    // Trabajando con activo boolean
    let boolActivo: boolean;
    let filtrados: any[];
  
    // Creando variable booleana
    if(activo === 'true') boolActivo = true;
    else if(activo === 'false') boolActivo = false; 
    
    // Filtrado Activo - Inactivo - Todos
    if(activo === 'true' || activo === 'false'){
      filtrados = valores.filter( valor => {
        return valor.activo == boolActivo;
      });
    }else{
      filtrados = valores; 
    }
    
    // Filtrado por parametro
    parametro = parametro.toLocaleLowerCase();
    
    if(parametro.length !== 0){
      return filtrados.filter( valor => { 
        return valor.descripcion.toLocaleLowerCase().includes(parametro) ||
               valor.identificacion.toLocaleLowerCase().includes(parametro)
      });
    }else{
      return filtrados;
    }

  }

}
