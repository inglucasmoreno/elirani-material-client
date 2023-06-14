import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ObrasMaderaService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nueva obra
  nuevaObra(data: any): Observable<any> {
    return this.http.post(`${base_url}/obras-madera`, data, {
      headers: this.getToken
    });
  };

  // Obra por ID
  getObra(id: number): Observable<any> {
    return this.http.get(`${base_url}/obras-madera/${id}`, {
      headers: this.getToken
    });
  };

  // Listar obras
  listarObras(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/obras-madera`, {
      params: {
        direccion: parametros?.direccion || -1,
        columna: parametros?.columna || 'createdAt',
        activo: parametros?.activo || '',
        parametro: parametros?.parametro || '',
        desde: parametros?.desde || 0,
        cantidadItems: parametros?.cantidadItems || 10000000,
        estado: parametros?.estado || ''
      },
      headers: this.getToken
    });
  }

  // Actualizar obra
  actualizarObra(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/obras-madera/${id}`, data, {
      headers: this.getToken
    });
  } 

  // Pase atras
  paseAtras(id: number): Observable<any> {
    return this.http.patch(`${base_url}/obras-madera/pase/atras/${id}`, {}, {
      headers: this.getToken
    });
  } 

  // Pase adelante
  paseAdelante(id: number): Observable<any> {
    return this.http.patch(`${base_url}/obras-madera/pase/adelante/${id}`, {}, {
      headers: this.getToken
    });
  } 

  // Eliminar obra
  eliminarObra(id: number): Observable<any> {
    return this.http.delete(`${base_url}/obras-madera/${id}`, {
      headers: this.getToken
    });
  } 

}
