import { Component } from '@angular/core';
import { InicializacionService } from '../services/inicializacion.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-inicializacion',
  templateUrl: './inicializacion.component.html',
  styleUrls: ['./inicializacion.component.scss']
})
export class InicializacionComponent {

  constructor(
    private inicializacionService: InicializacionService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void { }

  // Inicializacion de sistema
  inicializarUsuarios(): void {
    this.alertService.loading();
    this.inicializacionService.inicializarSistema().subscribe(({ message }) => {
      this.alertService.success(message);
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });
  }

}
