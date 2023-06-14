import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  // Modal
  public showModalCliente: boolean = false;

  // Estado formulario 
  public estadoFormulario: string = 'crear';

  // Cliente
  public idCliente: number = 0;
  public clientes: any = [];
  public clienteSeleccionado: any;

  // DataForm - Cliente
  public descripcion: string = ''; // Razon social
  public tipo_identificacion: string = 'DNI';
  public identificacion: string = '';
  public telefono: string = '';
  public direccion: string = '';
  public email: string = '';

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
    private clientesService: ClientesService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Clientes';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.listarClientes();
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('PERSONAS_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, cliente: any = null): void {
    this.reiniciarFormulario();

    this.idCliente = 0;

    if (estado === 'editar') this.getCliente(cliente);
    else this.showModalCliente = true;

    this.estadoFormulario = estado;
  }

  // Traer datos de cliente
  getCliente(cliente: any): void {
    this.alertService.loading();
    this.idCliente = cliente.id;
    this.clienteSeleccionado = cliente;
    this.clientesService.getCliente(cliente.id).subscribe(({ cliente }) => {

      // DataForm - Cliente
      this.descripcion = cliente.descripcion; // Razon social
      this.tipo_identificacion = cliente.tipo_identificacion;
      this.identificacion = cliente.identificacion;
      this.telefono = cliente.telefono;
      this.direccion = cliente.direccion;
      this.email = cliente.email;

      this.alertService.close();
      this.showModalCliente = true;

    }, ({ error }) => {
      this.alertService.errorApi(error);
    });
  }

  // Listar clientes
  listarClientes(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      activo: this.filtro.activo,
      parametro: this.filtro.parametro,
      desde: this.desde,
      cantidadItems: this.cantidadItems,
    }
    this.clientesService.listarClientes(parametros).subscribe({
        next: ({ clientes, totalItems }) => {
          this.clientes = clientes;
          this.totalItems = totalItems;
          this.showModalCliente = false;
          this.alertService.close();
        },error: ({ error }) => this.alertService.errorApi(error.message)
      })
  }

  // Nuevo cliente
  nuevoCliente(): void {

    // Verificacion: Descripcion vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripcion');
      return;
    }

    // Verificacion: Tipo de identificacion
    if (this.tipo_identificacion.trim() === "") {
      this.alertService.info('Debes seleccionar un tipo de identificacion');
      return;
    }

    // Verificacion: Telefono
    if (this.telefono.trim() === "") {
      this.alertService.info('Debes colocar una teléfono');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion, // Razon social
      tipo_identificacion: this.tipo_identificacion,
      identificacion: this.identificacion.trim(),
      telefono: this.telefono,
      direccion: this.direccion,
      email: this.email,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.clientesService.nuevoCliente(data).subscribe({
      next: () => {
        this.listarClientes();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Actualizar cliente
  actualizarCliente(): void {

    // Verificacion: Descripcion vacia
    if (this.descripcion.trim() === "") {
      this.alertService.info('Debes colocar una descripcion');
      return;
    }

    // Verificacion: Tipo de identificacion
    if (this.tipo_identificacion.trim() === "") {
      this.alertService.info('Debes seleccionar un tipo de identificacion');
      return;
    }

    // Verificacion: Telefono
    if (this.telefono.trim() === "") {
      this.alertService.info('Debes colocar una teléfono');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion, // Razon social
      tipo_identificacion: this.tipo_identificacion,
      identificacion: this.identificacion.trim(),
      telefono: this.telefono,
      direccion: this.direccion,
      email: this.email,
      updatorUser: this.authService.usuario.userId,
    }

    this.clientesService.actualizarCliente(this.idCliente, data).subscribe({
      next: () => {
        this.listarClientes();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(cliente: any): void {

    const { id, activo } = cliente;

    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {

          this.alertService.loading();

          this.clientesService.actualizarCliente(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarClientes();
            }, error: ({ error }) => {
              this.alertService.close();
              this.alertService.errorApi(error.message)
            }
          })

        }
      });

  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.descripcion = ''; // Razon social
    this.tipo_identificacion = 'DNI';
    this.identificacion = '';
    this.telefono = '';
    this.direccion = '';
    this.email = '';
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: string): void {
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
    this.listarClientes();
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
    this.listarClientes();
  }

}
