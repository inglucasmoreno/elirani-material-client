import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import gsap from 'gsap';
import { Permisos } from 'src/app/interface/permisos';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss']
})
export class NuevoUsuarioComponent {

  public showModalPermisos: boolean = false;

  // Permisos
  public permisos: Permisos = {
    clientes: 'CLIENTES_ALL',
    madera: 'MADERA_ALL',
    config_generales: 'CONFIG_GENERALES_NOT',
    config_madera: 'CONFIG_MADERA_NOT',
  };

  // Modelo reactivo
  public usuarioForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    // Animaciones y Datos de ruta
    gsap.from('.gsap-contenido', { y: 100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = 'Dashboard - Creando usuario';

    // Formulario reactivo
    this.usuarioForm = this.fb.group({
      usuario: ['testing', Validators.required],
      apellido: ['testing', Validators.required],
      nombre: ['testing', Validators.required],
      dni: ['34060111', Validators.required],
      email: ['testing@gmail.com', Validators.required],
      password: ['craneo', Validators.required],
      repetir: ['craneo', Validators.required],
      role: ['ADMIN_ROLE', Validators.required],
      activo: ['true', Validators.required]
    });

  }

  // Crear nuevo usuario
  nuevoUsuario(): void {

    const { status } = this.usuarioForm;
    const { usuario, apellido, nombre, dni, email, password, repetir } = this.usuarioForm.value;

    // Se verifica que los campos no tengan un espacio vacio
    const campoVacio = usuario.trim() === '' ||
      apellido.trim() === '' ||
      dni.trim() === '' ||
      email.trim() === '' ||
      nombre.trim() === '' ||
      password.trim() === '' ||
      repetir.trim() === '';

    // Se verifica si los campos son invalidos
    if (status === 'INVALID' || campoVacio) {
      this.alertService.formularioInvalido();
      return;
    }

    // Se verifica si las contraseñas coinciden
    if (password !== repetir) {
      this.alertService.info('Las contraseñas deben coincidir');
      return;
    }

    let data: any = this.usuarioForm.value;
    data.activo = data.activo === 'true' ? true : false; // Adaptacion de tipo -> String a Boolean

    this.adicionarPermisos(data);
    
    this.alertService.loading();

    // Se crear el nuevo usuario
    this.usuariosService.nuevoUsuario(data).subscribe({
      next: () => {
        this.router.navigateByUrl('dashboard/usuarios'); 
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
    
  }

  // Abrir permisos
  abrirPermisos(): void {
    this.showModalPermisos = true;
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
  adicionarPermisos(data: any): void{
    
    // Se agregan los permisos
    data.permisos = [];

    if(this.usuarioForm.value.role !== 'ADMIN_ROLE'){
      data.permisos.push({ 
        alcance: 'CLIENTES', 
        permiso: this.permisos.clientes, 
        creatorUser:this.authService.usuario.userId,
        updatorUser:this.authService.usuario.userId, 
      });
      data.permisos.push({ 
        alcance: 'MADERA', 
        permiso: this.permisos.madera,
        creatorUser:this.authService.usuario.userId,
        updatorUser:this.authService.usuario.userId, 
      });
      data.permisos.push({ 
        alcance: 'CONFIG_GENERALES', 
        permiso: this.permisos.config_generales,
        creatorUser:this.authService.usuario.userId,
        updatorUser:this.authService.usuario.userId, 
      });
      data.permisos.push({ 
        alcance: 'CONFIG_MADERA', 
        permiso: this.permisos.config_madera,
        creatorUser:this.authService.usuario.userId,
        updatorUser:this.authService.usuario.userId, 
      });
    }

  }

}
