import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import gsap from 'gsap';

import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public hide: boolean = true;

  public dataLogin = {
    username: '',
    password: ''
  }


  constructor(private fb: FormBuilder,
              private alertService: AlertService,
              private authService: AuthService,
              private router: Router  
  ) {}

  ngOnInit(): void {

    var tl = gsap.timeline({ defaults: { duration: 0.1 } });
    tl.from('.gsap-formulario', { y:-100, opacity: 0, duration: .5 })
      .from('.gsap-fondo', { y:100, opacity: 0, duration: .5 })
      .from('.gsap-imagen', { y:100, opacity: 0, duration: .5 });
  
  }

  login(): void {

    // Verificacion: Usuario
    if(this.dataLogin.username.trim() === ''){
      this.alertService.info('Debe colocar un usuario');
      return;
    }

    // Verificacion: Password
    if(this.dataLogin.password.trim() === ''){
      this.alertService.info('Debe colocar una contraseña');
      return;  
    }

    this.alertService.loading();

    this.authService.login(this.dataLogin).subscribe({
      next: () => {
        this.alertService.close();     
        this.router.navigateByUrl('dashboard/home');
      }, error: ({ error }) => {
        this.alertService.errorApi(error.message); 
      }
    });

  }

}
