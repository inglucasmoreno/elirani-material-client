import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ObrasMaderaMotivosPasesService } from 'src/app/services/obras-madera-motivos-pases.service';
import { ModalObrasMaderaMotivosPasesComponent } from 'src/app/shared/modals/modal-obras-madera-motivos-pases/modal-obras-madera-motivos-pases.component';

@Component({
  selector: 'app-obras-madera-motivos-pases',
  templateUrl: './obras-madera-motivos-pases.component.html',
  styleUrls: ['./obras-madera-motivos-pases.component.scss']
})
export class ObrasMaderaMotivosPasesComponent {

  public permisosTotales = ['CONFIG_MADERA_ALL'];
  public displayedColumns: string[] = ['opciones','descripcion', 'createdAt', 'activo'];
  public dataSource = new MatTableDataSource<any>();

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  // Motivos de pases
  public motivos: any = [];

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
    private motivosService: ObrasMaderaMotivosPasesService,
    private alertService: AlertService,
    private dataService: DataService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Motivos de pases';
    this.alertService.loading();
    this.listarMotivos();
  }

  public openModal(accion: string = 'Crear', elemento: any = {}): void {

    let dataForm: any = {}

    if(accion === 'Editar'){      
      dataForm = {
        id: elemento.id,
        descripcion: elemento.descripcion,
        activo: elemento.activo,
      }
    }else{
      dataForm = {
        id: 0,
        descripcion: '',
        activo: true,
      }
    }

    const dialogRef = this.dialog.open(ModalObrasMaderaMotivosPasesComponent, {
      width: '500px',
      data: {
        accion,
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(() => { this.listarMotivos(); });

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

  // Listar motivos
  listarMotivos(): void {

    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
    }

    this.motivosService.listarMotivos(parametros).subscribe({
      next: ({ motivos, totalItems }) => {
        this.motivos = motivos;
        this.totalItems = totalItems;
        this.resultsLength = totalItems;
        this.dataSource.data = motivos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

}
