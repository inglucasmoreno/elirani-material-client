import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rol'
})
export class RolPipe implements PipeTransform {

  transform(role: string): string {
    return role === 'ADMIN_ROLE' ? 'Root' 
    : role === 'MADERA_ROLE' ? 'Empleado madera' 
    : role === 'ALUMINIO_ROLE' ? 'Empleado aluminio' 
    : role === 'ADMINISTRATIVO_ROLE' ? 'Administrador'
    : 'Rol no encontrado';
  }

}
