import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ModalPerfilComponent } from '../modals/modal-perfil/modal-perfil.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor( 
    public dialog: MatDialog,
    public authService: AuthService 
  ){}

  public panelOpenState = false;

    // Permisos para navegacion
    public permisoNavClientes = ['CLIENTES_ALL', 'CLIENTES_READ'];
    public permisoNavMadera = ['MADERA_ALL', 'MADERA_READ'];
    public permisoNavConfigGenerales = ['CONFIG_GENERALES_ALL', 'CONFIG_GENERALES_READ'];
    public permisoNavConfigMadera = ['CONFIG_MADERA_ALL', 'CONFIG_MADERA_READ'];
    public permisoNavConfig = [
      ...this.permisoNavConfigGenerales, 
      ...this.permisoNavConfigMadera 
    ];

  logout(): void { this.authService.logout(); }

  public openModalPerfil(): void {
    this.dialog.open(ModalPerfilComponent, {
      width: '500px',
    });
  }


}
