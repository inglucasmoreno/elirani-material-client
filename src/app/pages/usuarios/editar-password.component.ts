import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import gsap from 'gsap';
import { Usuario } from 'src/app/interface';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-editar-password',
  templateUrl: './editar-password.component.html',
  styleUrls: ['./editar-password.component.scss']
})
export class EditarPasswordComponent {

  public id: number = 0;
  public loading = true;
  public usuario: Usuario = {
    id: 0,
    usuario: '',
    apellido: '',
    nombre: '',
    email: '',
    role: '',
  };
  public passwordForm = this.fb.group({
    password: ['', Validators.required],
    repetir: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y: 100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = 'Dashboard - Editando contraseña'
    this.alertService.loading();
    this.activatedRoute.params.subscribe({
      next: ({ id }) => {
        this.id = id;
        this.usuariosService.getUsuario(id).subscribe(usuario => {
          this.usuario = usuario;
          this.alertService.close();
        });
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Actualizar constraseña
  actualizarPassword(): void | boolean {
    const { password, repetir } = this.passwordForm.value;

    // Verificacion - Falta de datos
    if (password?.trim() === '' || repetir?.trim() === '') {
      this.alertService.formularioInvalido();
      return false;
    }

    // Verificacion - Coincidencia de contraseñas
    if (password !== repetir) {
      this.alertService.info('Las contraseñas deben coincidir');
      return false;
    }

    this.alertService.loading();
    this.usuario.password = password!;
    
    this.usuariosService.actualizarUsuario(this.id, this.usuario).subscribe({
      next: () => {
        this.alertService.close();
        this.router.navigateByUrl('/dashboard/usuarios');
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    }) 
  }
}
