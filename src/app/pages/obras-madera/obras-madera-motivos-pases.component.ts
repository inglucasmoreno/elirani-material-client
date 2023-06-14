import { Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ObrasMaderaMotivosPasesService } from 'src/app/services/obras-madera-motivos-pases.service';

@Component({
  selector: 'app-obras-madera-motivos-pases',
  templateUrl: './obras-madera-motivos-pases.component.html',
  styleUrls: ['./obras-madera-motivos-pases.component.scss']
})
export class ObrasMaderaMotivosPasesComponent {

  // Modal
  public showModalMotivo = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Motivo de pases
  public idMotivo: number = 0;
  public motivos: any = [];
  public motivoSeleccionado: any;

  // DataForm - Motivo
  public descripcion: string = ''; // Motivo de pase

  // Paginacion
  public totalItems: number = 0;
  public desde: number = 0;
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'descripcion'
  }

  constructor(
    private motivosService: ObrasMaderaMotivosPasesService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Motivos';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.listarMotivos();
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('PERSONAS_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, motivo: any = null): void {
    this.reiniciarFormulario();

    this.idMotivo = 0;

    if (estado === 'editar') {
      this.idMotivo = motivo.id;
      this.motivoSeleccionado = motivo;
      this.descripcion = motivo.descripcion;
    }

    this.estadoFormulario = estado;
    this.showModalMotivo = true;
  }

  // Listar motivos
  listarMotivos(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
      desde: this.desde,
      cantidadItems: this.cantidadItems,
    }
    this.motivosService.listarMotivos(parametros).subscribe({
      next: ({ motivos, totalItems }: any) => {
        this.motivos = motivos;
        this.totalItems = totalItems;
        this.showModalMotivo = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Nuevo motivo
  nuevoMotivo(): void {

    // Verificacion: Descripcion vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripcion');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion, // Razon social
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.motivosService.nuevoMotivo(data).subscribe({
      next: () => {
        this.listarMotivos();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Actualizar motivo
  actualizarMotivo(): void {

    // Verificacion: Descripcion vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripcion');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion, // Razon social
      updatorUser: this.authService.usuario.userId,
    }

    this.motivosService.actualizarMotivo(this.idMotivo, data).subscribe({
      next: () => {
        this.listarMotivos();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(motivo: any): void {

    const { id, activo } = motivo;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.motivosService.actualizarMotivo(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarMotivos(); 
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });

  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.descripcion = ''; // Razon social
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void {
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }

  // Filtrar por Parametro
  filtrarParametro(parametro: string): void {
    this.paginaActual = 1;
    this.filtro.parametro = parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string) {
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1;
    this.alertService.loading();
    this.listarMotivos();
  }

  // Cambiar cantidad de items
  cambiarCantidadItems(): void {
    this.paginaActual = 1
    this.cambiarPagina(1);
  }

  // Paginacion - Cambiar pagina
  cambiarPagina(nroPagina: number): void {
    this.paginaActual = nroPagina;
    this.desde = (this.paginaActual - 1) * this.cantidadItems;
    this.alertService.loading();
    this.listarMotivos();
  }

}
