import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TiposPlacasMaderaService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo tipo
  nuevoTipo(data: any): Observable<any> {
    return this.http.post(`${base_url}/tipos-placas-madera`, data, {
      headers: this.getToken
    });
  };

  // Tipo por ID
  getTipo(id: number): Observable<any> {
    return this.http.get(`${base_url}/tipos-placas-madera/${id}`, {
      headers: this.getToken
    });
  };

  // Listar tipos
  listarTipos(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/tipos-placas-madera`, {
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

  // Actualizar tipo
  actualizarTipo(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/tipos-placas-madera/${id}`, data, {
      headers: this.getToken
    });
  }

}
