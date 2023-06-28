import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { add, format } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { MueblesService } from 'src/app/services/muebles.service';
import { ObrasMaderaPasesService } from 'src/app/services/obras-madera-pases.service';
import { ObrasMaderaService } from 'src/app/services/obras-madera.service';
import { OrdenesMantenimientoMaderaService } from 'src/app/services/ordenes-mantenimiento-madera.service';
import { ModalMueblesComponent } from 'src/app/shared/modals/modal-muebles/modal-muebles.component';
import { ModalObrasMaderaPasesComponent } from 'src/app/shared/modals/modal-obras-madera-pases/modal-obras-madera-pases.component';
import { ModalObrasMaderaComponent } from 'src/app/shared/modals/modal-obras-madera/modal-obras-madera.component';
import { ModalOrdenesMantenimientoComponent } from 'src/app/shared/modals/modal-ordenes-mantenimiento/modal-ordenes-mantenimiento.component';

@Component({
  selector: 'app-obras-madera-detalles',
  templateUrl: './obras-madera-detalles.component.html',
  styleUrls: ['./obras-madera-detalles.component.scss']
})
export class ObrasMaderaDetallesComponent implements AfterViewInit {

  // Permisos totales
  public permisosTotales = ['OBRAS_MADERA_ALL'];

  // Obra
  public idObra = 0;
  public obra: any = {};

  // Muebles
  public muebles: any = [];
  public dataSourceMuebles = new MatTableDataSource<any>();
  public resultsLengthMuebles = 0;
  public isLoadingResultsMuebles = true;
  public isRateLimitReachedMuebles = false;
  public displayedColumnsMuebles: string[] = ['opciones', 'id', 'precio', 'tipo_mueble', 'createdAt'];

  // Pases
  public pases: any[] = [];

  // Ordenes mantenimiento
  public ordenesMantenimiento: any[] = [];

  // Ordenar
  public ordenarHistorialPases = {
    direccion: 1,
    columna: 'createdAt'
  }

  public ordenarOrdenesMantenimiento = {
    direccion: -1,
    columna: 'fecha'
  }

  @ViewChild(MatTabGroup) tabGroup: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private obrasMaderaService: ObrasMaderaService,
    private obrasMaderaPasesService: ObrasMaderaPasesService,
    private ordenesMantenimientoMaderaService: OrdenesMantenimientoMaderaService,
    private mueblesService: MueblesService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngAfterViewInit() {
    this.tabGroup.disablePagination = true;
  }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = 'Dashboard - Detalles de obra';
    this.activatedRoute.params.subscribe(({ id }) => {
      this.idObra = id;
      this.inicialializacion();
    });
  }

  // Inicializacion de pagina
  inicialializacion(): void {
    this.obrasMaderaService.getObra(this.idObra).subscribe({
      next: ({ obra }) => {
        this.obra = obra;
        this.muebles = obra.muebles;
        console.log(this.muebles);
        this.generarDataSourceMuebles(this.muebles);
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  getObra(): void {
    this.obrasMaderaService.getObra(this.idObra).subscribe({
      next: ({ obra }) => {
        this.obra = obra;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  openModalEditarObra(): void {

    let dataForm = {
      id: this.obra.id,
      cliente: this.obra.cliente.id,
      codigo: this.obra.codigo,
      fecha_inicio: new Date(),
      fecha_finalizacion_estimada: format(add(new Date(this.obra.fecha_finalizacion_estimada), { hours: 3 }), 'yyyy-MM-dd') === '1970-01-01' ? '' : this.obra.fecha_finalizacion_estimada,
      direccion: this.obra.direccion,
      descripcion: this.obra.descripcion,
      activo: true
    }

    const dialogRef = this.dialog.open(ModalObrasMaderaComponent, {
      width: '500px',
      data: {
        accion: 'Editar',
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getObra();
    });

  }

  openModalPases(): void {

    let dataForm = {
      obra_madera: this.obra.id,
      tipo: 'Atras',
      etapa_actual: '',
      etapa_anterior: this.obra.estado,
      observacion: '',
      motivo: '',
    }

    const dialogRef = this.dialog.open(ModalObrasMaderaPasesComponent, {
      width: '500px',
      data: {
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(({ etapa_actual }) => {
      if (etapa_actual) {
        this.obra.estado = etapa_actual;
        this.alertService.close();
      }
    });

  }

  public openModalMueble(accion: string = 'Crear', elemento: any = {}): void {

    let dataForm: any = {}

    if (accion === 'Editar') {
      dataForm = {
        id: elemento.id,
        obra_madera: this.idObra,
        tipo_mueble: elemento.tipo_mueble.id,
        precio: elemento.precio,
        observaciones: elemento.observaciones,
        muebleConPlacas: elemento.tipo_mueble.placas,
        placas: elemento.muebles_placas
      }
    } else {
      dataForm = {
        id: 0,
        obra_madera: this.idObra,
        tipo_mueble: null,
        precio: null,
        observaciones: '',
        muebleConPlacas: false,
        placas: [],
      }
    }

    const dialogRef = this.dialog.open(ModalMueblesComponent, {
      width: '500px',
      data: {
        accion,
        dataForm,
      }
    });

    dialogRef.afterClosed().subscribe(({ accion, mueble, idMueble }) => {
      
      // CREAR MUEBLE
      if (mueble && accion === 'Crear') {
        this.muebles.unshift(mueble);
        this.actualizarPrecio();
      
      // ACTUALIZAR MUEBLE
      } else if (mueble && accion === 'Editar') {
        this.muebles.find((elemento: any) => {
          if (elemento.id === mueble.id) {
            elemento.precio = mueble.precio;
            elemento.observaciones = mueble.observaciones;
            elemento.tipo_mueble = mueble.tipo_mueble;
          }
        })
        this.actualizarPrecio();

      // ELIMINAR MUEBLE
      } else if (idMueble && accion === 'Eliminar') {
        this.muebles = this.muebles.filter((elemento: any) => elemento.id !== idMueble);
        this.actualizarPrecio();
      }
      this.alertService.close();
    });

  }

  public openModalOrdenMantenimiento(
    accion: string = 'Crear',
    elemento: any = {},
  ): void {

    let dataForm: any = {}

    if (accion === 'Editar') {
      dataForm = {
        id: elemento.id,
        fecha: elemento.fecha,
        obra_madera: elemento.obra_madera.id,
        precio: elemento.precio,
        observaciones: elemento.observaciones,
      }
    } else {
      dataForm = {
        id: 0,
        fecha: '',
        obra_madera: this.obra.id,
        tipo_mueble: null,
        precio: null,
        observaciones: '',
      }
    }

    const dialogRef = this.dialog.open(ModalOrdenesMantenimientoComponent, {
      width: '500px',
      data: {
        accion,
        dataForm,
        parametrosFijos: true // Parametros fijos -> Obra fija
      }
    });

    dialogRef.afterClosed().subscribe(({ accion, orden, idOrden }) => {
      if (orden && accion === 'Crear') {
        this.ordenesMantenimiento.unshift(orden);
      } else if (orden && accion === 'Editar') {
        this.ordenesMantenimiento.find((elemento: any) => {
          if (elemento.id === orden.id) {
            elemento.fecha = orden.fecha;
            elemento.precio = orden.precio;
            elemento.observaciones = orden.observaciones;
          }
        })
      } else if (idOrden && accion === 'Eliminar') {
        this.ordenesMantenimiento = this.ordenesMantenimiento.filter(elemento => elemento.id !== idOrden);
      }
      this.alertService.close();
    });

  }

  // Pase adelante
  paseAdelante(): void {

    let proximaEtapa = '';
    if (this.obra?.estado === 'Pendiente') proximaEtapa = 'Produccion';
    else if (this.obra?.estado === 'Produccion') proximaEtapa = 'Colocacion';
    else if (this.obra?.estado === 'Colocacion') proximaEtapa = 'Finalizada';

    this.alertService.question({ msg: `¿Quieres pasar la obra a ${proximaEtapa}?`, buttonText: 'Generar pase' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {

          this.alertService.loading();

          const data = {
            obra_madera: this.obra.id,
            tipo: 'Adelante',
            observacion: '',
            motivo: 1,
            etapa_anterior: this.obra?.estado,
            etapa_actual: proximaEtapa,
            creatorUser: this.authService.usuario.userId,
            updatorUser: this.authService.usuario.userId,
          };

          this.obrasMaderaPasesService.nuevoPase(data).subscribe({
            next: ({ pase }) => {
              this.pases.unshift(pase);
              if (data.etapa_actual === 'Finalizada') {
                this.getObra();
              } else {
                this.obra.estado = proximaEtapa;
                this.alertService.close();
              }
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });

  }

  // Eliminar mueble
  eliminarMueble(mueble: any): void {
    this.alertService.question({ msg: `Estas por eliminar el mueble M${mueble.id}`, buttonText: 'Eliminar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.mueblesService.eliminarMueble(mueble.id).subscribe({
            next: () => {
              this.muebles = this.muebles.filter((elemento: any) => elemento.id !== mueble.id);
              this.actualizarPrecio();
              this.generarDataSourceMuebles(this.muebles);
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  // Eliminar obra
  eliminarObra(): void {
    this.alertService.question({ msg: `Estas por eliminar la obra MA${this.obra.codigo}`, buttonText: 'Eliminar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.obrasMaderaService.eliminarObra(this.obra.id).subscribe({
            next: () => {
              this.router.navigateByUrl('/dashboard/obras-madera');
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  // Actualizar precio
  actualizarPrecio(): void {
    let precioTMP = 0;
    this.muebles.map((mueble: any) => precioTMP += mueble.precio);
    this.obra.precio = precioTMP;
  }

  // Historial de pases
  opcionTab({ index }: any): void {

    // Index 0 -> Detalles de obra


    // Index 1 -> Ordenes mantenimiento
    if (index === 1) {
      this.listarOrdenesMantenimiento();
    }

    // Index 2 -> Historial de pases
    if (index === 2) {
      this.listarHistorialPases();
    }

  }

  // Ordenes de mantenimiento
  listarOrdenesMantenimiento(): void {
    this.alertService.loading();
    const parametros = {
      obra_madera: this.obra.id,
      direccion: this.ordenarOrdenesMantenimiento.direccion,
      columna: this.ordenarOrdenesMantenimiento.columna
    }
    this.ordenesMantenimientoMaderaService.listarOrdenes(parametros).subscribe({
      next: ({ ordenes }) => {
        this.ordenesMantenimiento = ordenes;
        console.log(ordenes);
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Historial de pases
  listarHistorialPases(): void {
    this.alertService.loading();

    const parametros = {
      obra_madera: this.obra.id,
      direccion: this.ordenarHistorialPases.direccion,
      columna: this.ordenarHistorialPases.columna
    }

    this.obrasMaderaPasesService.listarPases(parametros).subscribe({
      next: ({ pases }) => {
        console.log(pases);
        this.pases = pases;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Ordenar historial de pases
  ordenarHistorialPasesFnc(direccion: number): void {
    this.ordenarHistorialPases.direccion = direccion;
    this.listarHistorialPases();
  }

  // Ordenar ordenes de mantenimiento
  ordenarOrdenesMantenimientoFnc(direccion: number): void {
    this.ordenarOrdenesMantenimiento.direccion = direccion;
    this.listarOrdenesMantenimiento();
  }

  // TABLA - MUEBLES

  filtradoTablaMuebles(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMuebles.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceMuebles.paginator) {
      this.dataSourceMuebles.paginator.firstPage();
    }
  }

  ordenarTablaMuebles(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  generarDataSourceMuebles(elementos: any): void {
    this.dataSourceMuebles = new MatTableDataSource<any>(elementos);
    this.resultsLengthMuebles = this.muebles.length;
    this.dataSourceMuebles.data = elementos;
    this.dataSourceMuebles.paginator = this.paginator;
    this.dataSourceMuebles.sort = this.sort;
    this.isLoadingResultsMuebles = false;
  }

}
