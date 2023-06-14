import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { LoginForm } from '../interface';
import { UsuarioOnline } from '../models';

const base_url = environment.base_url;

interface tokenRespuesta {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get getToken(): any {
    return {
      'Authorization': localStorage.getItem('token')
    };
  }

  // Informacion de usuario logueado
  public usuario: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Login de usuario
  login(data: LoginForm): Observable<any> {
    return this.http.post<tokenRespuesta>(`${base_url}/auth/login`, data)
      .pipe(
        tap(({ token }) => {
          const tokenSend = 'bearer ' + token;
          localStorage.setItem('token', tokenSend);
        })
      )
  }

  // Cerrar sesion
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }

  // Validar token
  validarToken(): Observable<any> {

    return this.http.get(`${base_url}/profile`, {
      headers: this.getToken
    }).pipe(
      map((resp: any) => {
        const { userId, usuario, apellido, nombre, role, permisos } = resp.usuario;
        this.usuario = new UsuarioOnline(userId, usuario, nombre, apellido, role, permisos);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false)) // el of permite devolver un observable<boolean>(false)
    );

  }

  // Devuelve "true" si es ADMIN o "false" si no lo es
  validarAdmin(): Observable<boolean> {
    return this.http.get(`${base_url}/profile`, 
    { headers: this.getToken }
    ).pipe(
      map((resp: any) => {
        if (resp.usuario.role === 'ADMIN_ROLE') {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  // Proteccion de login
  proteccionLogin(): Observable<boolean> {
    return this.http.get(`${base_url}/auth`, {
      // headers: { 'x-token': token  }
      headers: this.getToken // TODO: REVISAR ESTA PARTE!!
    }).pipe(
      map(() => {
        return false;
      }),
      catchError(error => of(true))
    );
  }

}
