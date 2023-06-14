import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable, map } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  constructor(private http: HttpClient) { }

  // Usuario por ID
  getUsuario(id: number): Observable<any> {
    return this.http.get(`${base_url}/usuarios/${id}`, {
      headers: this.getToken
    }).pipe(
      map((resp: any) => resp.usuario)
    )
  }

  // Listar usuarios
  listarUsuarios({direccion = 'ASC', columna = 'apellido'}): Observable<any> {
    return this.http.get(`${base_url}/usuarios`, {
      params: {
        direccion: String(direccion),
        columna
      },
      headers: this.getToken
    })
  }

  // Nuevo usuario
  nuevoUsuario(data: any): Observable<any> {
    return this.http.post(`${base_url}/usuarios`, data, {
      headers: this.getToken
    })
  }

  // Actualizar usuario
  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/usuarios/${id}`, data, {
      headers: this.getToken
    })
  }

  // Actualizar password
  actualizarPasswordPerfil(id: number, data: any): Observable<any> {
    return this.http.patch(`${base_url}/usuarios/password/${id}`, data, {
      headers: this.getToken
    })
  }

}
