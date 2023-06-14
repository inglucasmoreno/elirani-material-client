import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interface';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import gsap from 'gsap';
import { Permisos } from 'src/app/interface/permisos';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent {

  public id: number = 0;
  public usuario!: Usuario;
  public usuarioForm!: FormGroup;
  public showModalPermisos: boolean = false;

  // Permisos
  public permisos: Permisos = {
    clientes: 'CLIENTES_NOT',
    madera: 'MADERA_NOT',
    config_generales: 'CONFIG_GENERALES_NOT',
    config_madera: 'CONFIG_MADERA_NOT',
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    // Animaciones y Datos de ruta
    gsap.from('.gsap-contenido', { y: 100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = 'Dashboard - Editando usuario';

    // Formulario reactivo
    this.usuarioForm = this.fb.group({
      usuario: ['', Validators.required],
      apellido: ['', Validators.required],
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', Validators.email],
      role: ['USER_ROLE', Validators.required],
      activo: ['true', Validators.required],
    });

    this.getUsuario(); // Datos iniciales de usuarios

  }

  // Datos iniciales de usuarios
  getUsuario(): void {

    // Se buscan los datos iniciales del usuario a editar
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ id }) => { this.id = id; });
    this.usuariosService.getUsuario(this.id).subscribe({
      next: (usuarioRes) => {

        this.usuario = usuarioRes;
        const { usuario, apellido, nombre, dni, email, role, activo } = this.usuario;
        this.usuarioForm.patchValue({
          usuario,
          apellido,
          nombre,
          dni,
          email,
          role,
          activo: String(activo)
        });
        this.permisosIniciales();
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Editar usuario
  editarUsuario(): void | boolean {

    const { usuario, apellido, dni, role, nombre, email } = this.usuarioForm.value;

    // Se verifica que los campos no tengan un espacio vacio
    const campoVacio = usuario.trim() === '' ||
      apellido.trim() === '' ||
      dni.trim() === '' ||
      email.trim() === '' ||
      nombre.trim() === '';

    // Se verifica que todos los campos esten rellenos
    if (this.usuarioForm.status === 'INVALID' || campoVacio) {
      this.alertService.formularioInvalido()
      return false;
    }

    let data: any = this.usuarioForm.value;
    data.activo = data.activo === 'true' ? true : false; // Adaptacion de tipo

    this.adicionarPermisos(data);

    this.alertService.loading();

    this.usuariosService.actualizarUsuario(this.id, data).subscribe({
      next: () => {
        this.alertService.close();
        this.router.navigateByUrl('dashboard/usuarios');
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Abrir permisos
  abrirPermisos(): void {
    this.showModalPermisos = true;
  }

  // Funcion del boton regresar
  regresar(): void {
    this.router.navigateByUrl('/dashboard/usuarios');
  }

  // Asignar permisos inciales
  permisosIniciales(): void {
    this.usuario.permisos?.map(({ alcance, permiso }) => {

      switch (alcance) {
        case 'CLIENTES':
          this.permisos.clientes = permiso;
          break;
        case 'MADERA':
          this.permisos.madera = permiso;
          break;
        case 'CONFIG_GENERALES':
          this.permisos.config_generales = permiso;
          break;
        case 'CONFIG_MADERA':
          this.permisos.config_madera = permiso;
          break;
        default:
          break;
      }

    });
  }

  // Cambiar rol
  cambiarRol(): void {

    const { role } = this.usuarioForm.value;

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

    if (this.usuarioForm.value.role !== 'ADMIN_ROLE') {
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
