import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DataService } from 'src/app/services/data.service';
import { ModalClientesComponent } from 'src/app/shared/modals/modal-clientes/modal-clientes.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  public permisosTotales = ['CLIENTES_ALL'];
  public displayedColumns: string[] = ['opciones','descripcion', 'identificacion', 'telefono', 'createdAt', 'activo'];
  public dataSource = new MatTableDataSource<any>();

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  // Clientes
  public clientes: any = [];

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
    private clientesService: ClientesService,
    private alertService: AlertService,
    private dataService: DataService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Clientes';
    this.alertService.loading();
    this.listarClientes();
  }

  public openModal(accion: string = 'Crear', elemento: any = {}): void {

    let dataForm: any = {}

    if(accion === 'Editar'){      
      dataForm = {
        id: elemento.id,
        descripcion: elemento.descripcion,
        tipo_identificacion: elemento.tipo_identificacion,
        identificacion: elemento.identificacion,
        telefono: elemento.telefono,
        direccion: elemento.direccion,
        activo: elemento.activo
      }
    }else{
      dataForm = {
        id: 0,
        descripcion: '',
        tipo_identificacion: 'DNI',
        identificacion: '',
        telefono: '',
        direccion: '',
        activo: true
      }
    }

    const dialogRef = this.dialog.open(ModalClientesComponent, {
      width: '500px',
      data: {
        accion,
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(() => { this.listarClientes(); });

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

  // Listar clientes
  listarClientes(): void {

    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
    }

    this.clientesService.listarClientes(parametros).subscribe({
      next: ({ clientes, totalItems }) => {
        this.clientes = clientes;
        this.totalItems = totalItems;
        this.resultsLength = totalItems;
        this.dataSource.data = clientes;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

}
