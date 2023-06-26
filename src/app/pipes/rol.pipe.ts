import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rol'
})
export class RolPipe implements PipeTransform {

  transform(role: string): string {
    return role === 'ADMIN_ROLE' ? 'Root' 
    : role === 'MADERA_ROLE' ? 'Empleado - Madera' 
    : role === 'ALUMINIO_ROLE' ? 'Empleado - Aluminio' 
    : role === 'ADMINISTRATIVO_ROLE' ? 'Administrativo'
    : 'Rol no encontrado';
  }

}
