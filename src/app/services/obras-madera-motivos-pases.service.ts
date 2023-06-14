import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ObrasMaderaMotivosPasesService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo motivo
  nuevoMotivo(data: any): Observable<any> {
    return this.http.post(`${base_url}/obras-madera-motivos-pases`, data, {
      headers: this.getToken
    });
  };

  // Motivo por ID
  getMotivo(id: number): Observable<any> {
    return this.http.get(`${base_url}/obras-madera-motivos-pases/${id}`, {
      headers: this.getToken
    });
  };

  // Listar motivos
  listarMotivos(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/obras-madera-motivos-pases`, {
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

  // Actualizar motivo
  actualizarMotivo(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/obras-madera-motivos-pases/${id}`, data, {
      headers: this.getToken
    });
  } 

}
