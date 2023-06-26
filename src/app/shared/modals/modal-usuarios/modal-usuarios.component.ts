import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-modal-usuarios',
  templateUrl: './modal-usuarios.component.html',
  styleUrls: ['./modal-usuarios.component.scss']
})
export class ModalUsuariosComponent {

  // Permisos
  public permisos: any = {
    clientes: 'CLIENTES_ALL',
    madera: 'MADERA_ALL',
    config_generales: 'CONFIG_GENERALES_NOT',
    config_madera: 'CONFIG_MADERA_NOT',
  };

  public hidePassword = true;
  public hideRepetir = true;

  public dataOutput = {
    id: 0,
    apellido: '',
    nombre: '',
    usuario: '',
    dni: '',
    email: '',
    password: '',
    repetir: '',
    role: 'ADMIN_ROLE',
    activo: true
  }

  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
  }

  // Nuevo usuario
  crearUsuario(): void {

    const { usuario, apellido, nombre, dni, email, password, repetir } = this.dataOutput;

    // Verificar: Usuario
    if (usuario.trim() === '') {
      this.alertService.info('Debe colocar un usuario');
      return;
    }

    // Verificar: Apellido
    if (apellido.trim() === '') {
      this.alertService.info('Debe colocar un apellido');
      return;
    }

    // Verificar: Nombre
    if (nombre.trim() === '') {
      this.alertService.info('Debe colocar un nombre');
      return;
    }

    // Verificar: DNI
    if (dni.trim() === '') {
      this.alertService.info('Debe colocar un DNI');
      return;
    }

    // Verificar: Email
    if (email.trim() === '') {
      this.alertService.info('Debe colocar un email');
      return;
    }

    // Verificar: Password
    if (password.trim() === '') {
      this.alertService.info('Debe colocar una constraña');
      return;
    }

    // Verificar: Repetir
    if (repetir.trim() === '') {
      this.alertService.info('Debe repetir la contraseña');
      return;
    }

    // Verificar: Password === Repetir
    if (password.trim() !== repetir.trim()) {
      this.alertService.info('La contraseñas deben coincidir');
      return;
    }

    const data = {
      ...this.dataOutput,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.cambiarRol();
    this.adicionarPermisos(data);

    this.alertService.loading();

    this.usuariosService.nuevoUsuario(data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Actualizar usuario
  actualizarUsuario(): void {

    const { id, usuario, apellido, nombre, dni, email } = this.dataOutput;

    // Verificar: Usuario
    if (usuario.trim() === '') {
      this.alertService.info('Debe colocar un usuario');
      return;
    }

    // Verificar: Apellido
    if (apellido.trim() === '') {
      this.alertService.info('Debe colocar un apellido');
      return;
    }

    // Verificar: Nombre
    if (nombre.trim() === '') {
      this.alertService.info('Debe colocar un nombre');
      return;
    }

    // Verificar: DNI
    if (dni.trim() === '') {
      this.alertService.info('Debe colocar un DNI');
      return;
    }

    // Verificar: Email
    if (email.trim() === '') {
      this.alertService.info('Debe colocar un email');
      return;
    }

    const data = {
      apellido: this.dataOutput.apellido,
      nombre: this.dataOutput.nombre,
      usuario: this.dataOutput.usuario,
      dni: this.dataOutput.dni,
      email: this.dataOutput.email,
      role: this.dataOutput.role,
      activo: this.dataOutput.activo,
      updatorUser: this.authService.usuario.userId,
    }

    this.cambiarRol();
    this.adicionarPermisos(data);

    this.alertService.loading();

    this.usuariosService.actualizarUsuario(id, data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });

  }

  // Cambiar rol
  cambiarRol(): void {

    const { role } = this.dataOutput;

    switch (role) {
      case 'ADMINISTRATIVO_ROLE':
        this.permisos = {
          clientes: 'CLIENTES_ALL',
          madera: 'MADERA_ALL',
          config_generales: 'CONFIG_GENERALES_NOT',
          config_madera: 'CONFIG_MADERA_ALL',
        };
        break;
      case 'MADERA_ROLE':
        this.permisos = {
          clientes: 'CLIENTES_NOT',
          madera: 'MADERA_ALL',
          config_generales: 'CONFIG_GENERALES_NOT',
          config_madera: 'CONFIG_MADERA_NOT',
        };
        break;
      case 'ALUMINIO_ROLE':
        this.permisos = {
          clientes: 'CLIENTES_NOT',
          madera: 'MADERA_NOT',
          config_generales: 'CONFIG_GENERALES_NOT',
          config_madera: 'CONFIG_MADERA_NOT',
        };
        break;
      default:
        break;
    }

  }

  // Adicionar permisos
  adicionarPermisos(data: any): void {

    // Se agregan los permisos
    data.permisos = [];

    if (this.dataOutput.role !== 'ADMIN_ROLE') {
      data.permisos.push({
        alcance: 'CLIENTES',
        permiso: this.permisos.clientes,
        creatorUser: this.authService.usuario.userId,
        updatorUser: this.authService.usuario.userId,
      });
      data.permisos.push({
        alcance: 'MADERA',
        permiso: this.permisos.madera,
        creatorUser: this.authService.usuario.userId,
        updatorUser: this.authService.usuario.userId,
      });
      data.permisos.push({
        alcance: 'CONFIG_GENERALES',
        permiso: this.permisos.config_generales,
        creatorUser: this.authService.usuario.userId,
        updatorUser: this.authService.usuario.userId,
      });
      data.permisos.push({
        alcance: 'CONFIG_MADERA',
        permiso: this.permisos.config_madera,
        creatorUser: this.authService.usuario.userId,
        updatorUser: this.authService.usuario.userId,
      });
    }

  }

}
