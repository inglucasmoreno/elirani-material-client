import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MueblesPlacasService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nueva relacion
  nuevaRelacion(data: any): Observable<any> {
    console.log(data);
    return this.http.post(`${base_url}/muebles-placas`, data, {
      headers: this.getToken
    });
  };

  // Relacion por ID
  getRelacion(id: number): Observable<any> {
    return this.http.get(`${base_url}/muebles-placas/${id}`, {
      headers: this.getToken
    });
  };

  // Listar relaciones
  listarRelaciones(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/muebles-placas`, {
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

  // Actualizar relacion
  actualizarRelacion(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/muebles-placas/${id}`, data, {
      headers: this.getToken
    });
  }

  // Eliminar relacion
  eliminarRelacion(id: number): Observable<any> {
    return this.http.delete(`${base_url}/muebles-placas/${id}`, {
      headers: this.getToken
    });
  }

}
