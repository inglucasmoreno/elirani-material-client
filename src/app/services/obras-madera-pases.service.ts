import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ObrasMaderaPasesService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo pase
  nuevoPase(data: any): Observable<any> {
    return this.http.post(`${base_url}/obras-madera-pases`, data, {
      headers: this.getToken
    });
  };

  // Pase por ID
  getPase(id: number): Observable<any> {
    return this.http.get(`${base_url}/obras-madera-pases/${id}`, {
      headers: this.getToken
    });
  };

  // Listar pases
  listarPases(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/obras-madera-pases`, {
      params: {
        direccion: parametros?.direccion || -1,
        columna: parametros?.columna || 'id',
        activo: parametros?.activo || '',
        parametro: parametros?.parametro || '',
        desde: parametros?.desde || 0,
        cantidadItems: parametros?.cantidadItems || 10000000,
        obra_madera: parametros?.obra_madera || ''
      },
      headers: this.getToken
    });
  }

  // Actualizar pase
  actualizarPase(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/obras-madera-pases/${id}`, data, {
      headers: this.getToken
    });
  } 

}
