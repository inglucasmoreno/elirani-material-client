import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { add, format } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ObrasMaderaService } from 'src/app/services/obras-madera.service';
import { ModalObrasMaderaComponent } from 'src/app/shared/modals/modal-obras-madera/modal-obras-madera.component';

@Component({
  selector: 'app-obras-madera',
  templateUrl: './obras-madera.component.html',
  styleUrls: ['./obras-madera.component.scss']
})
export class ObrasMaderaComponent {

  public permisosTotales = ['OBRAS_MADERA_ALL'];
  public displayedColumns: string[] = ['opciones', 'codigo', 'cliente.descripcion', 'fecha_inicio', 'fecha_finalizacion_estimada', 'estado'];
  public dataSource = new MatTableDataSource<any>();

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  // Obras
  public obras: any = [];

  // Paginacion
  public totalItems: number = 0;

  // Filtrado
  public filtro = {
    activo: '',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'fecha_finalizacion_estimada'
  }

  constructor(
    public dialog: MatDialog,
    private obrasMaderaService: ObrasMaderaService,
    private alertService: AlertService,
    private dataService: DataService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Obras madera';
    this.alertService.loading();
    this.listarObras();
  }

  public openModal(accion: string = 'Crear', elemento: any = {}): void {

    let dataForm: any = {}

    if (accion === 'Editar') {
      dataForm = {
        id: elemento.id,
        cliente: elemento.cliente.id,
        codigo: elemento.codigo,
        fecha_inicio: new Date(),
        fecha_finalizacion_estimada: format(add(new Date(elemento.fecha_finalizacion_estimada), {hours: 3}), 'yyyy-MM-dd') === '1970-01-01' ? '' : elemento.fecha_finalizacion_estimada,
        direccion: elemento.direccion,
        descripcion: elemento.descripcion,
        activo: true
      }
    } else {
      dataForm = {
        id: 0,
        cliente: null,
        codigo: '',
        fecha_inicio: new Date(),
        fecha_finalizacion_estimada: '',
        direccion: '',
        descripcion: '',
        activo: true
      }
    }


    const dialogRef = this.dialog.open(ModalObrasMaderaComponent, {
      width: '500px',
      data: {
        accion,
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(() => { this.listarObras(); });

  }

  filtradoTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

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

  // Listar obras
  listarObras(): void {

    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
    }

    this.obrasMaderaService.listarObras(parametros).subscribe({
      next: ({ obras, totalItems }) => {
        this.obras = obras;
        this.totalItems = totalItems;
        this.resultsLength = totalItems;
        this.dataSource.data = obras;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

}
