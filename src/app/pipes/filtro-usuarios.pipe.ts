import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroUsuarios'
})
export class FiltroUsuariosPipe implements PipeTransform {

  transform(valores: any[], parametro: string, activo: string): any {
    
    // Trabajando con activo boolean
    let boolActivo: boolean;
    let filtrados: any[] = [];
  
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
        return valor.apellido.toLocaleLowerCase().includes(parametro) ||
               valor.nombre.toLocaleLowerCase().includes(parametro) ||
               valor.usuario.toLocaleLowerCase().includes(parametro) ||
               valor.dni.includes(parametro)
      });
    }else{
      return filtrados;
    }

  }
  
}