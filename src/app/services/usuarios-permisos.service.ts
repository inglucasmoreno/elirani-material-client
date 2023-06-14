import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuariosPermisosService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo permiso
  nuevoPermiso(data: any): Observable<any> {
    return this.http.post(`${base_url}/usuarios-permisos`, data, {
      headers: this.getToken
    });
  };

  // Permiso por ID
  getPermiso(id: number): Observable<any> {
    return this.http.get(`${base_url}/usuarios-permisos/${id}`, {
      headers: this.getToken
    });
  };

  // Listar permisos
  listarPermisos(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/usuarios-permisos`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion',
        activo: parametros?.activo || '',
        parametro: parametros?.parametro || '',
        usuario: parametros?.usuario || 0,
        desde: parametros?.desde || 0,
        cantidadItems: parametros?.cantidadItems || 10000000,
      },
      headers: this.getToken
    });
  }

  // Actualizar permiso
  actualizarPermiso(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/usuarios-permisos/${id}`, data, {
      headers: this.getToken
    });
  }

  // Eliminar permiso
  eliminarPermiso(id: number): Observable<any> {
    return this.http.delete(`${base_url}/usuarios-permisos/${id}`, {
      headers: this.getToken
    });
  }

}
