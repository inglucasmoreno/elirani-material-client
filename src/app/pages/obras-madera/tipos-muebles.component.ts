import { Component } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { TiposMueblesService } from 'src/app/services/tipos-muebles.service';

@Component({
  selector: 'app-tipos-muebles',
  templateUrl: './tipos-muebles.component.html',
  styleUrls: ['./tipos-muebles.component.scss']
})
export class TiposMueblesComponent {

  // Modal
  public showModalTipo = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Tipos de muebles
  public idTipo: number = 0;
  public tipos: any = [];
  public tipoSeleccionado: any;

  // DataForm - Tipo
  public descripcion: string = '';    // Tipo de mueble
  public placas: string = 'true';      // Mueble con placas

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
    private tiposService: TiposMueblesService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Tipos de muebles';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.listarTipos();
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('PERSONAS_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, tipo: any = null): void {
    this.reiniciarFormulario();

    this.idTipo = 0;

    console.log(tipo);

    if (estado === 'editar') {
      this.idTipo = tipo.id;
      this.tipoSeleccionado = tipo;
      this.descripcion = tipo.descripcion;
      this.placas = tipo.placas ? 'true' : 'false';
      console.log(this.placas)
    }


    this.estadoFormulario = estado;
    this.showModalTipo = true;
  }

  // Listar tipos
  listarTipos(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
      desde: this.desde,
      cantidadItems: this.cantidadItems,
    }
    this.tiposService.listarTipos(parametros)
      .subscribe({
        next: ({ tipos, totalItems }) => {
          this.tipos = tipos;
          this.totalItems = totalItems;
          this.showModalTipo = false;
          this.alertService.close();
        }, error: ({ error }) => this.alertService.errorApi(error.message)
      })
  }

  // Nuevo tipo
  nuevoTipo(): void {

    // Verificacion: Descripcion vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripcion');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion,
      placas: this.placas === 'true' ? true : false,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.tiposService.nuevoTipo(data).subscribe({
      next: () => {
        this.listarTipos();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Actualizar tipo
  actualizarTipo(): void {

    // Verificacion: Descripcion vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripcion');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion, // Razon social
      placas: this.placas === 'true' ? true : false,
      updatorUser: this.authService.usuario.userId,
    }

    this.tiposService.actualizarTipo(this.idTipo, data).subscribe({
      next: () => {
        this.listarTipos();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(tipo: any): void {

    const { id, activo } = tipo;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {

          this.alertService.loading();

          this.tiposService.actualizarTipo(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarTipos();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          });

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
    this.listarTipos();
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
    this.listarTipos();
  }


}
