import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermisosGuard implements CanActivate {
  
  constructor(private authService:AuthService, private router: Router){}

  canActivate( // Detecta la entrada a una ruta
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verificarPermisos(route);
  }
  
  // Se verifica si el usuario esta autorizado para ingresar a la ruta
  verificarPermisos(route: any): boolean {

    
    const { permisos = [], role } = this.authService.usuario;
    
    let tienePermiso = false;

    for (const checkPermisos of route.data.permisos) {
          
      const coincide = permisos.find( (p: string) => {
        return (p.toUpperCase() === checkPermisos.toUpperCase());
      });
      
      if(coincide) {  // Si hay coincidencia se devuelve true y se finaliza el bucle
        tienePermiso = true;
        break
      }

    }  

    if(tienePermiso || role === 'ADMIN_ROLE'){ // Si tiene permiso o es ADMIN puede ingresar
      return true;
    }else{
      this.router.navigateByUrl('/dashboard/home');
      return false;  
    }

  }
  
}
