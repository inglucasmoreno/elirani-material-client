import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { TiposPlacasMaderaService } from 'src/app/services/tipos-placas-madera.service';
import { ModalTiposPlacasMaderaComponent } from 'src/app/shared/modals/modal-tipos-placas-madera/modal-tipos-placas-madera.component';

@Component({
  selector: 'app-tipos-placas',
  templateUrl: './tipos-placas.component.html',
  styleUrls: ['./tipos-placas.component.scss']
})
export class TiposPlacasComponent {

  public permisosTotales = ['CONFIG_MADERA_ALL'];
  public displayedColumns: string[] = ['opciones', 'codigo', 'descripcion', 'createdAt', 'activo'];
  public dataSource = new MatTableDataSource<any>();

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  // Tipos de placas
  public tipos: any = [];

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
    columna: 'descripcion'
  }

  constructor(
    public dialog: MatDialog,
    private tiposService: TiposPlacasMaderaService,
    private alertService: AlertService,
    private dataService: DataService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Tipos de placas';
    this.alertService.loading();
    this.listarTipos();
  }

  public openModal(accion: string = 'Crear', elemento: any = {}): void {

    let dataForm: any = {}

    if(accion === 'Editar'){      
      dataForm = {
        id: elemento.id,
        codigo: elemento.codigo,
        descripcion: elemento.descripcion,
        activo: elemento.activo,
      }
    }else{
      dataForm = {
        id: 0,
        codigo: '',
        descripcion: '',
        activo: true,
      }
    }

    const dialogRef = this.dialog.open(ModalTiposPlacasMaderaComponent, {
      width: '500px',
      data: {
        accion,
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(() => { this.listarTipos(); });

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

  // Listar tipos
  listarTipos(): void {

    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
    }

    this.tiposService.listarTipos(parametros).subscribe({
      next: ({ tipos, totalItems }) => {
        this.tipos = tipos;
        this.totalItems = totalItems;
        this.resultsLength = totalItems;
        this.dataSource.data = tipos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

}
