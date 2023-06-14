import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class InicializacionService {

  constructor(private http: HttpClient) { }

  // Inicializacion de sistema
  inicializarSistema(): Observable<any> {
    return this.http.get(`${base_url}/inicializacion`);
  }

}
