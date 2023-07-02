import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { TiposMueblesService } from 'src/app/services/tipos-muebles.service';
import { ModalTiposMueblesComponent } from 'src/app/shared/modals/modal-tipos-muebles/modal-tipos-muebles.component';

@Component({
  selector: 'app-tipos-muebles',
  templateUrl: './tipos-muebles.component.html',
  styleUrls: ['./tipos-muebles.component.scss']
})
export class TiposMueblesComponent {

  public displayedColumns: string[] = ['opciones', 'descripcion', 'placas', 'createdAt', 'activo'];
  public permisosTotales = ['CONFIG_MADERA_ALL'];
  public dataSource = new MatTableDataSource<any>();

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  // Tipos de muebles
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
    private tiposService: TiposMueblesService,
    private alertService: AlertService,
    private dataService: DataService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Tipos de muebles';
    this.alertService.loading();
    this.listarTipos();
  }

  public openModal(accion: string = 'Crear', elemento: any = {}): void {

    let dataForm: any = {}

    if(accion === 'Editar'){      
      dataForm = {
        id: elemento.id,
        descripcion: elemento.descripcion,
        placas: elemento.placas,
        activo: elemento.activo,
      }
    }else{
      dataForm = {
        id: 0,
        descripcion: '',
        placas: true,
        activo: true,
      }
    }

    const dialogRef = this.dialog.open(ModalTiposMueblesComponent, {
      width: '500px',
      data: {
        accion,
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(() => { this.listarTipos(); });

  }

  filtradoTabla() {

    const { parametro, activo } = this.filtro;

    let valores = [];

    // Filtrado por estado
    if(activo !== ''){
      valores = this.tipos.filter(
        (elemento: any) => (elemento.activo ? 'Alta' : 'Baja').includes(activo) 
      )       
    }else valores = this.tipos;


    valores = valores.filter(
      (elemento: any) =>
        elemento.descripcion.toLowerCase().includes(parametro) ||
        (elemento.placas ? 'Con placas' : 'Sin placas').toLowerCase().includes(parametro)
    );

    this.dataSource.data = valores;

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
        this.filtradoTabla();
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

}
