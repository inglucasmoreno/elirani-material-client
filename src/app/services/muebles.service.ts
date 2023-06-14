import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MueblesService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo mueble
  nuevoMueble(data: any): Observable<any> {
    return this.http.post(`${base_url}/muebles`, data, {
      headers: this.getToken
    });
  };

  // Mueble por ID
  getMueble(id: number): Observable<any> {
    return this.http.get(`${base_url}/muebles/${id}`, {
      headers: this.getToken
    });
  };

  // Listar muebles
  listarMuebles(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/muebles`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'descripcion',
        activo: parametros?.activo || '',
        parametro: parametros?.parametro || '',
        desde: parametros?.desde || 0,
        cantidadItems: parametros?.cantidadItems || 10000000,
      },
      headers: this.getToken
    });
  }

  // Actualizar mueble
  actualizarMueble(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/muebles/${id}`, data, {
      headers: this.getToken
    });
  } 

  // Eliminar mueble
  eliminarMueble(id: number): Observable<any> {
    return this.http.delete(`${base_url}/muebles/${id}`, {
      headers: this.getToken
    });
  } 

}
