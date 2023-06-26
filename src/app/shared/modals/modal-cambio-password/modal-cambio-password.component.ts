import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-modal-cambio-password',
  templateUrl: './modal-cambio-password.component.html',
  styleUrls: ['./modal-cambio-password.component.scss']
})
export class ModalCambioPasswordComponent {

  public hidePassword = true;
  public hideRepetir = true;

  public dataOutput = { repetir: '', password: '' };

  constructor(
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalCambioPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {}

  // Actualizar constraseña
  actualizarPassword(): void | boolean {

    const { password, repetir } = this.dataOutput;

    // Verificacion - Falta de datos
    if(password?.trim() === ''){
      this.alertService.info('La contraseña no puede estar vacia');
      return;
    }

    if (repetir?.trim() === '') {
      this.alertService.info('Debes repetir la contraseña')
      return;
    }

    // Verificacion - Coincidencia de contraseñas
    if (password !== repetir) {
      this.alertService.info('Las contraseñas deben coincidir');
      return false;
    }

    this.alertService.loading();

    this.usuariosService.actualizarUsuario(this.dataInput.usuario.id, { password }).subscribe({
      next: () => {
        this.alertService.close();
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    }) 

  }

}
