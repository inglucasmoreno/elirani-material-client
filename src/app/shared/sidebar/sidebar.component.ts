import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  // Flags - Navegacion
  public administrador = false;
  public showMadera = false;
  public showConfiguraciones = false;

  // Fleg - Navegacion - Submenu
  public showConfigGenerales = false;
  public showConfigMadera = false;

  // Permisos para navegacion
  public permisoNavClientes = ['CLIENTES_ALL', 'CLIENTES_READ'];
  public permisoNavMadera = ['MADERA_ALL', 'MADERA_READ'];
  public permisoNavConfigGenerales = ['CONFIG_GENERALES_ALL', 'CONFIG_GENERALES_READ'];
  public permisoNavConfigMadera = ['CONFIG_MADERA_ALL', 'CONFIG_MADERA_READ'];
  public permisoNavConfig = [
    ...this.permisoNavConfigGenerales, 
    ...this.permisoNavConfigMadera 
  ];

  constructor(
    public authService: AuthService,
    public dataService: DataService
  ) { }

  ngOnInit(): void {}

  abrirCerrarMadera(): void {
    this.showMadera = !this.showMadera;
  }

  abrirCerrarConfiguraciones(): void {
    this.showConfiguraciones = !this.showConfiguraciones;
    this.showConfigGenerales = false;
    this.showConfigMadera = false;
  }

  // Metodo: Cerrar sesion
  logout(): void { this.authService.logout(); }


}
