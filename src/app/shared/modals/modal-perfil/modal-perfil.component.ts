import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-modal-perfil',
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.scss']
})
export class ModalPerfilComponent {

  public hidePasswordActual = true;
  public hidePasswordNuevo= true;
  public hidePasswordNuevoRepetir = true;
  public usuarioLogin: any;

  public dataOutput = { password_actual: '', password_nuevo: '', password_nuevo_repetir: '' };

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalPerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
  }

  // Actualizar constraseña
  actualizarPassword(): void | boolean {

    const { password_actual, password_nuevo, password_nuevo_repetir } = this.dataOutput;

    if( password_actual.trim() === ''){
      this.alertService.info('Debe colocar la contraseña actual');
      return;
    }

    if( password_nuevo.trim() === ''){
      this.alertService.info('Debe colocar la nueva contraseña');
      return;
    }

    if( password_nuevo_repetir.trim() === ''){
      this.alertService.info('Debe repetir la nueva contraseña');
      return;
    }

    if( password_nuevo.trim() !== password_nuevo_repetir.trim()){
      this.alertService.info('Las contraseñas no coinciden');
      return;
    }

    this.alertService.loading();

    console.log(this.dataOutput);

    this.usuariosService.actualizarPasswordPerfil(this.usuarioLogin.userId, this.dataOutput).subscribe({
      next: () => {
        this.alertService.close();
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

}
