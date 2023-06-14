import { Component } from '@angular/core';
import { format } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { OrdenesMantenimientoMaderaService } from 'src/app/services/ordenes-mantenimiento-madera.service';
import { ObrasMaderaService } from '../../services/obras-madera.service';

@Component({
  selector: 'app-ordenes-matenimiento',
  templateUrl: './ordenes-matenimiento.component.html',
  styleUrls: ['./ordenes-matenimiento.component.scss']
})
export class OrdenesMatenimientoMaderaComponent {

  // Modal
  public showModalOrden = false;
  public showOptionsObrasMadera = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Orden de mantenimiento
  public idOrden: number = 0;
  public ordenes: any[] = [];
  public ordenSeleccionada: any;

  // DataForm - Orden
  public dataOrdenMantenimiento = {
    obra_madera: 0,
    fecha: format(new Date(), 'yyyy-MM-dd'),
    observaciones: '',
    precio: null,
    creatorUser: this.authService.usuario.userId,
    updatorUser: this.authService.usuario.userId,
  }

  // Obras Madear
  public obrasMadera: any[] = [];
  public obraSeleccionada: any = null;

  public codigo: string = '';
  public descripcion: string = '';

  // Paginacion
  public totalItems: number = 0;
  public desde: number = 0;
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: '',
    parametroObraMadera: ''
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'id'
  }

  constructor(
    private ordenesService: OrdenesMantenimientoMaderaService,
    private authService: AuthService,
    private alertService: AlertService,
    private obrasMaderaService: ObrasMaderaService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Ordenes de mantenimiento';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.cargaInicial();
  }

  cargaInicial(): void {
    this.alertService.loading();
    this.obrasMaderaService.listarObras({}).subscribe({
      next: ({ obras }) => {
        this.obrasMadera = obras;
        this.listarOrdenes();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Abrir modal
  abrirModal(estado: string, orden: any = null): void {
    this.reiniciarFormulario();

    this.idOrden = 0;

    this.reiniciarFormulario();

    if (estado === 'editar') {
      this.idOrden = orden.id;
      this.ordenSeleccionada = orden;
      this.dataOrdenMantenimiento.precio = orden.precio;
      this.dataOrdenMantenimiento.obra_madera = orden.obra_madera.id;
      this.dataOrdenMantenimiento.observaciones = orden.observaciones;
      this.dataOrdenMantenimiento.fecha = format(new Date(orden.fecha), 'yyyy-MM-dd');
    }

    this.showModalOrden = true;
    this.estadoFormulario = estado;
  }

  // Listar ordenes
  listarOrdenes(): void {

    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
      desde: this.desde,
      cantidadItems: this.cantidadItems,
    }

    this.ordenesService.listarOrdenes(parametros).subscribe({
      next: ({ ordenes, totalItems }) => {
        this.ordenes = ordenes;
        this.totalItems = totalItems;
        this.showModalOrden = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Nueva orden
  nuevaOrden(): void {

    const { fecha } = this.dataOrdenMantenimiento;

    // Validaciones
    if (!fecha) {
      this.alertService.info('Debe colocar una fecha');
      return;
    }

    this.alertService.loading();

    const data = {
      codigo: this.codigo,
      descripcion: this.descripcion,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.ordenesService.nuevaOrden(data).subscribe({
      next: () => {
        this.listarOrdenes();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Actualizar orden
  actualizarOrden(): void {

    const { fecha } = this.dataOrdenMantenimiento;

    // Validaciones
    if (!fecha) {
      this.alertService.info('Debe colocar una fecha');
      return;
    }

    this.alertService.question({ msg: '¿Quieres actualizar la orden?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.ordenesService.actualizarOrden(this.idOrden, this.dataOrdenMantenimiento).subscribe({
            next: () => {
              this.listarOrdenes();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          }
          );
        }
      });
      
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(orden: any): void {

    const { id, activo } = orden;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.ordenesService.actualizarOrden(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarOrdenes();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });

  }

  eliminarOrden(): void {
    this.alertService.question({ msg: '¿Quieres eliminar la orden?', buttonText: 'Eliminar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.ordenesService.eliminarOrden(this.ordenSeleccionada.id).subscribe({
            next: () => {
              this.listarOrdenes();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  // Seleccionar obra
  seleccionarObra(obra: any): void {
    this.obraSeleccionada = obra;
  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.dataOrdenMantenimiento = {
      obra_madera: 0,
      fecha: format(new Date(), 'yyyy-MM-dd'),
      observaciones: '',
      precio: null,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }
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
    this.listarOrdenes();
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
    this.listarOrdenes();
  }

}
