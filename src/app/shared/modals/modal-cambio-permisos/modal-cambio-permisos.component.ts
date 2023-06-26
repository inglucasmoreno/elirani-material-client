import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-modal-cambio-permisos',
  templateUrl: './modal-cambio-permisos.component.html',
  styleUrls: ['./modal-cambio-permisos.component.scss']
})
export class ModalCambioPermisosComponent {

  public dataOutput = {
    clientes: 'CLIENTES_NOT',
    madera: 'MADERA_NOT',
    config_generales: 'CONFIG_GENERALES_NOT',
    config_madera: 'CONFIG_MADERA_NOT',
  };

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalCambioPermisosComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.permisosIniciales();
  }

  // Asignar permisos inciales
  permisosIniciales(): void {

    const { role } = this.dataInput.usuario;

    if (role === 'ADMIN_ROLE') {
      this.dataOutput.clientes = 'CLIENTES_ALL';
      this.dataOutput.madera = 'MADERA_ALL';
      this.dataOutput.config_generales = 'CONFIG_GENERALES_ALL';
      this.dataOutput.config_madera = 'CONFIG_MADERA_ALL';
    } else {
      this.dataInput.usuario.permisos?.map(({ alcance, permiso }: any) => {

        switch (alcance) {
          case 'CLIENTES':
            this.dataOutput.clientes = permiso;
            break;
          case 'MADERA':
            this.dataOutput.madera = permiso;
            break;
          case 'CONFIG_GENERALES':
            this.dataOutput.config_generales = permiso;
            break;
          case 'CONFIG_MADERA':
            this.dataOutput.config_madera = permiso;
            break;
          default:
            break;
        }

      });
    }

  }

  // Adicionar permisos
  adicionarPermisos(data: any): void {

    const { role } = this.dataInput.usuario;

    // Se agregan los permisos
    data.permisos = [];

    if (role !== 'ADMIN_ROLE') {
      data.permisos.push({
        alcance: 'CLIENTES',
        permiso: this.dataOutput.clientes,
        creatorUser: this.authService.usuario.userId,
        updatorUser: this.authService.usuario.userId,
      });
      data.permisos.push({
        alcance: 'MADERA',
        permiso: this.dataOutput.madera,
        creatorUser: this.authService.usuario.userId,
        updatorUser: this.authService.usuario.userId,
      });
      data.permisos.push({
        alcance: 'CONFIG_GENERALES',
        permiso: this.dataOutput.config_generales,
        creatorUser: this.authService.usuario.userId,
        updatorUser: this.authService.usuario.userId,
      });
      data.permisos.push({
        alcance: 'CONFIG_MADERA',
        permiso: this.dataOutput.config_madera,
        creatorUser: this.authService.usuario.userId,
        updatorUser: this.authService.usuario.userId,
      });
    }

  }

  // Actualizar permisos
  actualizarPermisos(): void | boolean {
    this.alertService.loading();
    const data = {};
    this.adicionarPermisos(data);
    this.usuariosService.actualizarUsuario(this.dataInput.usuario.id, data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

}
