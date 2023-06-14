import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class OrdenesMantenimientoMaderaService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nueva orden
  nuevaOrden(data: any): Observable<any> {
    return this.http.post(`${base_url}/ordenes-mantenimiento-madera`, data, {
      headers: this.getToken
    });
  };

  // Orden por ID
  getOrden(id: number): Observable<any> {
    return this.http.get(`${base_url}/ordenes-mantenimiento-madera/${id}`, {
      headers: this.getToken
    });
  };
  
  // Listar ordenes
  listarOrdenes(parametros?: any): Observable<any> {
    console.log(parametros);
    return this.http.get(`${base_url}/ordenes-mantenimiento-madera`, {
      params: {
        direccion: parametros?.direccion || 1,
        columna: parametros?.columna || 'createdAt',
        activo: parametros?.activo || '',
        parametro: parametros?.parametro || '',
        desde: parametros?.desde || 0,
        cantidadItems: parametros?.cantidadItems || 10000000,
      },
      headers: this.getToken
    });
  }

  // Imprimir orden
  imprimirOrden(id: number = 0): Observable<any> {
    return this.http.get(`${base_url}/ordenes-mantenimiento-madera/imprimir/${id}`, {
      headers: this.getToken
    });
  }

  // Actualizar orden
  actualizarOrden(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/ordenes-mantenimiento-madera/${id}`, data, {
      headers: this.getToken
    });
  }

  // Eliminar orden
  eliminarOrden(id: number): Observable<any> {
    return this.http.delete(`${base_url}/ordenes-mantenimiento-madera/${id}`, {
      headers: this.getToken
    });
  }

}
