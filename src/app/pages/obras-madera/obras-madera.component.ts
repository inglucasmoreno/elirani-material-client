import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DataService } from 'src/app/services/data.service';
import { ObrasMaderaService } from 'src/app/services/obras-madera.service';

@Component({
  selector: 'app-obras-madera',
  templateUrl: './obras-madera.component.html',
  styleUrls: ['./obras-madera.component.scss']
})
export class ObrasMaderaComponent {

  // Constantes
  public LIMITE_FECHA_FINALIZACION = format(new Date(), 'yyyy-MM-dd');

  // Flag
  public showOptionsClientes = false;

  // Modal
  public showModalObra = false;
  public showModalCliente = false;

  // Estado formulario 
  public estadoFormulario = 'crear';

  // Obras
  public idObra: number = 0;
  public obras: any = [];
  public obraSeleccionada: any;

  // Cliente
  public clientes: any[] = [];
  public clienteSeleccionado: any = null;
  public identificacionCliente: string = '';

  // DataForm - Cliente
  public descripcion_cliente: string = ''; // Razon social
  public tipo_identificacion: string = 'DNI';
  public codigo: string = '';
  public identificacion: string = '';
  public telefono: string = '';
  public direccion_cliente: string = '';
  public email: string = '';

  // DataForm - Obra
  public descripcion: string = '';
  public cliente: string = '';
  public direccion: string = '';
  public fecha_inicio: string = '';
  public fecha_finalizacion_estimada: string = '';

  // Paginacion
  public totalItems: number = 0;
  public desde: number = 0;
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Filtrado
  public filtro = {
    estado: '',
    parametro: '',
    parametroCliente: ''
  }

  // Ordenar
  public ordenar = {
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'estado'
  }

  constructor(
    private obrasService: ObrasMaderaService,
    private authService: AuthService,
    private alertService: AlertService,
    private dataService: DataService,
    private clientesService: ClientesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fecha_inicio = format(new Date(), 'yyyy-MM-dd');
    this.dataService.ubicacionActual = 'Dashboard - Obras (Madera)';
    // this.permisos.all = this.permisosUsuarioLogin();
    this.alertService.loading();
    this.listarObras();
  }

  // Asignar permisos de usuario login
  // permisosUsuarioLogin(): boolean {
  //   return this.authService.usuario.permisos.includes('PERSONAS_ALL') || this.authService.usuario.role === 'ADMIN_ROLE';
  // }

  // Abrir modal
  abrirModal(estado: string, obra: any = null): void {

    this.alertService.loading();

    this.clientesService.listarClientes().subscribe({
      next: ({ clientes }: any) => {

        this.clientes = clientes.filter((cliente: any) => cliente.activo);
        this.showOptionsClientes = false;

        this.reiniciarFormulario();

        this.idObra = 0;

        if (estado === 'editar') {
          this.idObra = obra.id;
          this.obraSeleccionada = obra;
          this.descripcion = obra.descripcion;
          this.direccion = obra.direccion;
          this.cliente = obra.cliente.id;
          this.fecha_inicio = format(new Date(obra.fecha_inicio), 'yyyy-MM-dd');
          this.fecha_finalizacion_estimada = format(new Date(obra.fecha_finalizacion_estimada), 'yyyy-MM-dd');
          this.clienteSeleccionado = obra.cliente;
          this.showModalObra = true;
        }
        else this.showModalObra = true;

        this.estadoFormulario = estado;

        this.alertService.close();

      }, error: ({ error }: any) => this.alertService.errorApi(error.message)
    })

  }

  // Abir modal - Creacion de cliente
  abrirModalNuevoCliente(): void {
    this.reiniciarFormularioCliente();
    this.showModalCliente = true;
    this.showModalObra = false;
  }

  // Regresar a obra
  regresarObra(): void {
    this.showModalCliente = false;
    this.showModalObra = true;
    this.showOptionsClientes = false;
    this.filtro.parametroCliente = '';
  }

  // Buscar cliente
  buscarCliente(): void {

    // Verificacion - DNI, CUIT o CUIL de cliente
    if (this.identificacionCliente === '') {
      this.alertService.info('Debe colocar el DNI, CUIL o CUIT del cliente');
      return;
    }

    this.alertService.loading();

    this.clientesService.getPorIdentificacion(this.identificacionCliente).subscribe({
      next: ({ cliente }: any) => {
        if (!cliente) { // El cliente no existe
          this.alertService.info('El cliente no existe');
          return;
        } else if (!cliente.activo) { // El cliente esta inactivo
          this.alertService.info('El cliente se encuentra inactivo');
          return;
        } else {
          this.clienteSeleccionado = cliente;
          this.alertService.close();
        }
      }, error: ({ error }: any) => this.alertService.errorApi(error.message)
    })

  }

  // Seleccionar cliente
  seleccionarCliente(cliente: any): void {
    this.clienteSeleccionado = cliente;
    this.showOptionsClientes = false;
    this.filtro.parametroCliente = '';
  }

  // Eliminar cliente
  eliminarCliente(): void {
    this.clienteSeleccionado = null;
    this.identificacionCliente = '';
  }

  // Listar obras
  listarObras(): void {
    const parametros = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna,
      parametro: this.filtro.parametro,
      desde: this.desde,
      cantidadItems: this.cantidadItems,
      estado: this.filtro.estado,
    }
    this.obrasService.listarObras(parametros).subscribe({
      next: ({ obras, totalItems }: any) => {
        this.obras = obras;
        this.totalItems = totalItems;
        this.showModalObra = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Nueva obra
  nuevaObra(): void {

    // Verificacion: Código de obra
    if (this.codigo.trim() === "") {
      this.alertService.info('Debes colocar el código de obra');
      return;
    }

    // Verificacion: Cliente
    if (!this.clienteSeleccionado) {
      this.alertService.info('Debes seleccionar un cliente');
      return;
    }

    // Verificacion: fecha de inicio
    if (this.fecha_inicio.trim() === "") {
      this.alertService.info('Debes colocar una fecha de inicio');
      return;
    }

    // Verificacion: direccion
    if (this.direccion.trim() === "") {
      this.alertService.info('Debes colocar una dirección');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion,
      codigo: this.codigo,
      cliente: this.clienteSeleccionado.id,
      direccion: this.direccion,
      fecha_inicio: this.fecha_inicio,
      fecha_finalizacion_estimada: this.fecha_finalizacion_estimada === '' ? '1970-01-01' : this.fecha_finalizacion_estimada,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.obrasService.nuevaObra(data).subscribe({
      next: ({ obra }: any) => {
        this.router.navigateByUrl(`/dashboard/obras-madera/detalles/${obra.id}`);
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
    
  }

  // Actualizar obra
  actualizarObra(): void {

    // Verificacion: Cliente
    if (!this.clienteSeleccionado) {
      this.alertService.info('Debes seleccionar un cliente');
      return;
    }

    // Verificacion: direccion
    if (this.direccion.trim() === "") {
      this.alertService.info('Debes colocar una dirección');
      return;
    }

    // Verificacion: fecha de inicio
    if (this.fecha_inicio.trim() === "") {
      this.alertService.info('Debes colocar una fecha de inicio');
      return;
    }

    // Verificacion: fecha de finalizacion estimada
    if (this.fecha_finalizacion_estimada.trim() === "") {
      this.alertService.info('Debes colocar una fecha de finalizacion estimada');
      return;
    }

    this.alertService.loading();

    const data = {
      cliente: this.clienteSeleccionado.id,
      descripcion: this.descripcion,
      codigo: this.codigo,
      direccion: this.direccion,
      fecha_inicio: this.fecha_inicio,
      fecha_finalizacion_estimada: this.fecha_finalizacion_estimada,
      updatorUser: this.authService.usuario.userId,
    }

    this.obrasService.actualizarObra(this.idObra, data).subscribe({
      next: () => {
        this.listarObras();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
    
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(obra: any): void {

    const { id, activo } = obra;

    this.alertService.question({ msg: '¿Quieres actualizar el estado de la obra?', buttonText: 'Actualizar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.obrasService.actualizarObra(id, { activo: !activo }).subscribe({
            next: () => {
              this.listarObras();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });

  }

  // Nuevo cliente
  nuevoCliente(): void {

    // Verificacion: Descripcion vacia
    if (this.descripcion_cliente.trim() === "") {
      this.alertService.info('Debes colocar un nombre o razón social');
      return;
    }

    // Verificacion: Tipo de identificacion
    if (this.tipo_identificacion.trim() === "") {
      this.alertService.info('Debes seleccionar un tipo de identificacion');
      return;
    }

    // Verificacion: Telefono
    if (this.telefono.trim() === "") {
      this.alertService.info('Debes colocar un número de teléfono');
      return;
    }

    this.alertService.loading();

    const data = {
      descripcion: this.descripcion_cliente, // Razon social
      tipo_identificacion: this.tipo_identificacion,
      identificacion: this.identificacion.trim(),
      telefono: this.telefono,
      direccion: this.direccion_cliente,
      email: this.email,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.clientesService.nuevoCliente(data).subscribe({
      next: ({ cliente }: any) => {
        this.clienteSeleccionado = cliente;
        this.clientes.unshift(cliente);
        this.showModalCliente = false;
        this.showOptionsClientes = false;
        this.showModalObra = true;
        this.filtro.parametroCliente = '';
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Reiniciando formulario
  reiniciarFormulario(): void {
    this.descripcion = '';
    this.cliente = '';
    this.direccion = '';
    this.fecha_inicio = format(new Date(), 'yyyy-MM-dd');
    this.fecha_finalizacion_estimada = '';
    this.clienteSeleccionado = null;
    this.identificacionCliente = '';
  }

  // Reiniciar formulario de nuevo cliente
  reiniciarFormularioCliente(): void {
    this.descripcion_cliente = ''; // Razon social
    this.tipo_identificacion = 'DNI';
    this.identificacion = '';
    this.telefono = '';
    this.direccion_cliente = '';
    this.email = '';
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
    this.listarObras();
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
    this.listarObras();
  }

}
