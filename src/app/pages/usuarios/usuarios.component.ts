import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/interface';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ModalCambioPasswordComponent } from 'src/app/shared/modals/modal-cambio-password/modal-cambio-password.component';
import { ModalCambioPermisosComponent } from 'src/app/shared/modals/modal-cambio-permisos/modal-cambio-permisos.component';
import { ModalUsuariosComponent } from 'src/app/shared/modals/modal-usuarios/modal-usuarios.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent {

  public permisosTotales = ['CONFIG_GENERALES_ALL'];
  public displayedColumns: string[] = ['opciones', 'apellido', 'usuario', 'rol', 'createdAt', 'activo'];
  public dataSource = new MatTableDataSource<any>();

  public resultsLength = 0;
  public isLoadingResults = true;
  public isRateLimitReached = false;

  // Usuarios
  public usuarios: any = [];

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
    columna: 'apellido'
  }

  constructor(
    public dialog: MatDialog,
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    private dataService: DataService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Usuarios';
    this.alertService.loading();
    this.listarUsuarios();
  }

  public openModal(accion: string = 'Crear', elemento: any = {}): void {

    let dataForm: any = {}

    if (accion === 'Editar') {
      dataForm = {
        id: elemento.id,
        apellido: elemento.apellido,
        nombre: elemento.nombre,
        usuario: elemento.usuario,
        dni: elemento.dni,
        email: elemento.email,
        password: '',
        repetir: '',
        role: elemento.role,
        activo: elemento.activo
      }
    } else {
      dataForm = {
        id: 0,
        apellido: '',
        nombre: '',
        usuario: '',
        dni: '',
        email: '',
        password: '',
        repetir: '',
        role: 'ADMIN_ROLE',
        activo: true
      }
    }

    const dialogRef = this.dialog.open(ModalUsuariosComponent, {
      width: '500px',
      data: {
        accion,
        dataForm
      }
    });

    dialogRef.afterClosed().subscribe(() => { this.listarUsuarios(); });

  }

  public openModalPassword(usuario: any): void {
    this.dialog.open(ModalCambioPasswordComponent, {
      width: '500px',
      data: { usuario }
    });
  }

  public openModalPermisos(usuario: any): void {
    const dialogRef = this.dialog.open(ModalCambioPermisosComponent, {
      width: '500px',
      data: { usuario }
    });
    dialogRef.afterClosed().subscribe(() => { this.listarUsuarios(); });
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

  // Listar usuarios
  listarUsuarios(): void {
    this.usuariosService.listarUsuarios({}).subscribe({
      next: ({ usuarios }) => {
        this.usuarios = usuarios;
        this.totalItems = usuarios.length;
        this.resultsLength = usuarios.length;
        this.dataSource.data = usuarios;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

}
