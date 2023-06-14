import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Nuevo cliente
  nuevoCliente(data: any): Observable<any> {
    return this.http.post(`${base_url}/clientes`, data, {
      headers: this.getToken
    });
  };

  // Cliente por ID
  getCliente(id: number): Observable<any> {
    return this.http.get(`${base_url}/clientes/${id}`, {
      headers: this.getToken
    });
  };

  // Cliente por identificacion
  getPorIdentificacion(identificacion: string): Observable<any> {
    return this.http.get(`${base_url}/clientes/identificacion/${identificacion}`, {
      headers: this.getToken
    });
  };

  // Listar clientes
  listarClientes(parametros?: any): Observable<any> {
    return this.http.get(`${base_url}/clientes`, {
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

  // Actualizar cliente
  actualizarCliente(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/clientes/${id}`, data, {
      headers: this.getToken
    });
  }

}
