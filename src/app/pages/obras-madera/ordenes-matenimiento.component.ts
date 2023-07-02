import { Component, ViewChild } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { OrdenesMantenimientoMaderaService } from 'src/app/services/ordenes-mantenimiento-madera.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModalOrdenesMantenimientoComponent } from 'src/app/shared/modals/modal-ordenes-mantenimiento/modal-ordenes-mantenimiento.component';
import { environment } from 'src/environments/environments';

const baseUrl = environment.base_url;

@Component({
  selector: 'app-ordenes-matenimiento',
  templateUrl: './ordenes-matenimiento.component.html',
  styleUrls: ['./ordenes-matenimiento.component.scss']
})
export class OrdenesMatenimientoMaderaComponent {

  public displayedColumns: string[] = ['opciones', 'id', 'fecha', 'obra_madera', 'observaciones', 'precio'];
  public dataSource = new MatTableDataSource<any>();

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  // Ordenes de mantenimiento
  public ordenes: any = [{}];

  // Paginacion
  public totalItems: number = 0;

  // Filtrado
  public filtro = {
    activo: '',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  constructor(
    public dialog: MatDialog,
    private ordenesService: OrdenesMantenimientoMaderaService,
    private alertService: AlertService,
    private dataService: DataService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Orden de mantenimiento';
    this.alertService.loading();
    this.listarOrdenes();
  }

  public openModal(accion: string = 'Crear', elemento: any = {}): void {

    let dataForm: any = {}

    if (accion === 'Editar') {
      dataForm = {
        id: elemento.id,
        fecha: elemento.fecha,
        obra_madera: elemento.obra_madera.id,
        observaciones: elemento.observaciones,
        precio: elemento.precio,
        activo: elemento.activo,
      }
    } else {
      dataForm = {
        id: 0,
        fecha: '',
        obra_madera: null,
        observaciones: '',
        precio: null,
        activo: true,
      }
    }
    const dialogRef = this.dialog.open(ModalOrdenesMantenimientoComponent, {
      width: '500px',
      data: {
        accion,
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listarOrdenes();
    });

  }

  filtradoTabla(event: Event) {

    const parametro = (event.target as HTMLInputElement).value.toLowerCase();

    this.dataSource.data = this.ordenes.filter(
      (elemento: any) =>
        elemento.id === Number(parametro) ||
        elemento.obra_madera.cliente.descripcion.toLowerCase().includes(parametro)
    );

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  ordenarTabla(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Listar ordenes
  listarOrdenes(): void {

    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
    }

    this.ordenesService.listarOrdenes(parametros).subscribe({
      next: ({ ordenes, totalItems }) => {
        this.ordenes = ordenes;
        this.totalItems = totalItems;
        this.resultsLength = totalItems;
        this.generarDataSource(ordenes);
        this.isLoadingResults = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  eliminarObra(orden: any): void {
    this.alertService.question({ msg: `Estas por eliminar la orden MA${orden.id}`, buttonText: 'Eliminar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.ordenesService.eliminarOrden(orden.id).subscribe({
            next: () => {
              this.ordenes = this.ordenes.filter((elemento: any) => (elemento.id !== orden.id));
              this.generarDataSource(this.ordenes);
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  // Generar data source - TABLA
  generarDataSource(elementos: any): void {
    this.dataSource.data = elementos;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  imprimirOrdenMantenimiento(orden: any): void {
    this.alertService.question({ msg: '¿Imprimir orden de mantenimiento?', buttonText: 'Imprimir' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          window.open(`${baseUrl}/ordenes-mantenimiento-madera/imprimir/${orden.id}`, '_blank');
          this.alertService.close();
        }
      });
  }

}
