import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import gsap from 'gsap';

import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private alertService: AlertService
  ) { }

  public usuarioLogin: Usuario = {
    id: 0,
    usuario: '',
    apellido: '',
    nombre: '',
    email: ''
  };
  
  public passwordForm!: FormGroup;

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y: 100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = "Dashboard - Perfil";
    this.getUsuario();

    // Formulario reactivo para password
    this.passwordForm = this.fb.group({
      password_actual: ['', Validators.required],
      password_nuevo: ['', Validators.required],
      password_nuevo_repetir: ['', Validators.required]
    });
  }

  // Obtener datos de usuario
  getUsuario(): void {
    
    this.alertService.loading();

    this.usuariosService.getUsuario(this.authService.usuario.userId).subscribe({
      next: (usuario: Usuario) => {
        console.log(usuario);
        this.alertService.close();
        this.usuarioLogin = usuario;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Actualizar password
  actualizarPassword(): void {

    const { password_actual, password_nuevo, password_nuevo_repetir } = this.passwordForm.value;

    if( password_actual === ''){
      this.alertService.info('Debe colocar la contraseña actual');
      return;
    }

    if( password_nuevo === ''){
      this.alertService.info('Debe colocar la nueva contraseña');
      return;
    }

    if( password_nuevo_repetir === ''){
      this.alertService.info('Debe repetir la nueva contraseña');
      return;
    }

    this.alertService.loading();

    const data = {
      password_actual,
      password_nuevo,
      password_nuevo_repetir
    }

    this.usuariosService.actualizarPasswordPerfil(this.usuarioLogin.id, data).subscribe({
      next: () => {
        this.reiniciarValores();
        this.alertService.success('Contraseña actualizada');
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Reiniciar valores
  reiniciarValores(): void {
    this.passwordForm.patchValue({
      password_actual: '',
      password_nuevo: '',
      password_nuevo_repetir: ''
    });
  }

}
