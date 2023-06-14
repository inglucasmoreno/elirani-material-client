import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DataService } from 'src/app/services/data.service';
import { MueblesPlacasService } from 'src/app/services/muebles-placas.service';
import { MueblesService } from 'src/app/services/muebles.service';
import { ObrasMaderaMotivosPasesService } from 'src/app/services/obras-madera-motivos-pases.service';
import { ObrasMaderaPasesService } from 'src/app/services/obras-madera-pases.service';
import { ObrasMaderaService } from 'src/app/services/obras-madera.service';
import { TiposMueblesService } from 'src/app/services/tipos-muebles.service';
import { TiposPlacasMaderaService } from 'src/app/services/tipos-placas-madera.service';
import gsap from 'gsap';
import { OrdenMantenimientoMadera } from 'src/app/interface';
import { OrdenesMantenimientoMaderaService } from 'src/app/services/ordenes-mantenimiento-madera.service';
import { environment } from 'src/environments/environments';

const baseUrl = environment.base_url;

@Component({
  selector: 'app-obras-madera-detalles',
  templateUrl: './obras-madera-detalles.component.html',
  styleUrls: ['./obras-madera-detalles.component.scss']
})
export class ObrasMaderaDetallesComponent {

  // Costantes
  public LIMITE_FECHA_FINALIZACION = '';

  // Flags
  public showOptionsClientes = false;
  public showSeccionPlacas = false;
  public showContenidoSeccion = 'Detalles';
  public showModalTipoPlaca = false;
  public showBusquedaPlacas = false;
  public showModalOrdenMantenimiento = false;
  public muebleConPlaca = true;

  // Estados de formulario
  public formularioMueble = 'Crear';

  // Shows - Modals
  public showEditarCliente = false;
  public showNuevoCliente = false;
  public showEditarObra = false;
  public showNuevoMueble = false;
  public showDetallesMueble = false;
  public showPaseAtras = false;

  // Formularios - Edicion
  public clienteSeleccionado: any = null;

  // DataForm - Cliente
  public descripcion_cliente: string = ''; // Razon social
  public tipo_identificacion: string = 'DNI';
  public identificacion: string = '';
  public codigo: string = '';
  public telefono: string = '';
  public direccion_cliente: string = '';
  public email: string = '';

  // DataForm - Obra
  public descripcion: string = '';
  public direccion: string = '';
  public fecha_inicio: string = '';
  public fecha_finalizacion_estimada: string = '';

  // Obra (Madera)
  public idObra: number = 0;
  public obra: any;
  public muebles: any[] = [];
  public motivos: any[] = [];
  public ordenesMantenimiento: any[] = [];

  // Mueble
  public muebleSeleccionado: any = null;
  public muebleObservaciones: string = '';
  public mueblePrecio: number = null!;
  public tipoMueble: string = '';
  public tiposMuebles: any[] = [];
  public tiposPlacas: any[] = [];
  public placas: any[] = [];

  // Pase
  public pases: any[] = [];
  public paseMotivo: string = '';
  public paseObservacion: string = '';
  public etapasRegreso: string[] = [];
  public proximaEtapa: string = '';

  // Clientes
  public clientes: any = [];

  // Placas
  public cantidadPlacas: number = null!;
  public listadoTiposPlacas: any = [];
  public tipoPlacaSeleccionado: any = null;

  // DataForm - Tipo
  public codigoPlaca: string = '';
  public descripcionPlaca: string = ''; // Tipo de placa

  // DataForm - Orden de mantenimiento
  public estadoFormularioOrden: string = 'crear';
  public ordenMantenmientoSeleccionada: OrdenMantenimientoMadera = {
    id: 0,
    obra_madera: 0,
    fecha: '',
    observaciones: '',
    precio: null,
    creatorUser: 0,
    updatorUser: 0
  }
  public dataOrdenMantenimiento: OrdenMantenimientoMadera = {
    obra_madera: 0,
    fecha: format(new Date(), 'yyyy-MM-dd'),
    observaciones: '',
    precio: null,
    creatorUser: this.authService.usuario.userId,
    updatorUser: this.authService.usuario.userId,
  }

  // Filtrado
  public filtro = {
    parametroCliente: '',
    parametroPlaca: ''
  }

  constructor(
    private authService: AuthService,
    private motivosPasesService: ObrasMaderaMotivosPasesService,
    private router: Router,
    private alertService: AlertService,
    private clientesService: ClientesService,
    private dataService: DataService,
    private obrasMaderaService: ObrasMaderaService,
    private obrasMaderaPasesService: ObrasMaderaPasesService,
    private mueblesService: MueblesService,
    private tiposMueblesService: TiposMueblesService,
    private mueblesPlacasService: MueblesPlacasService,
    private tiposPlacasService: TiposPlacasMaderaService,
    private ordenesMantenimientoService: OrdenesMantenimientoMaderaService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y: 100, opacity: 0, duration: .2 });
    this.dataService.ubicacionActual = 'Dashboard - Detalles de obra';
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.idObra = id;
      this.dataOrdenMantenimiento.obra_madera = id;
      this.inicializacion();
    })
  }

  // Inicializacion de componente
  inicializacion(): void {
    this.obrasMaderaService.getObra(this.idObra).subscribe({
      next: ({ obra }) => {
        this.obra = obra;
        this.muebles = obra.muebles;
        this.ordenesMantenimiento = obra.ordenes_mantenimiento;
        this.LIMITE_FECHA_FINALIZACION = format(new Date(obra.fecha_inicio), 'yyyy-MM-dd');
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Abrir - Editar cliente
  abrirEditarCliente(): void {
    this.alertService.loading();
    this.showOptionsClientes = false;
    this.filtro.parametroCliente = '';
    this.clienteSeleccionado = null;
    this.clientesService.listarClientes().subscribe({
      next: ({ clientes }) => {
        this.clientes = clientes;
        this.showEditarCliente = true;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
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
  }

  // Editar cliente
  editarCliente(): void {

    // Verificacion -> Cliente seleccionado 
    if (!this.clienteSeleccionado) {
      this.alertService.info('Debe seleccionar un cliente');
      return;
    }

    this.alertService.loading();

    this.obrasMaderaService.actualizarObra(this.idObra, {
      cliente: this.clienteSeleccionado.id,
      updatorUser: this.authService.usuario.userId,
    }).subscribe({
      next: () => {
        this.showEditarCliente = false;
        this.obra.cliente = this.clienteSeleccionado;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Abir modal - Creacion de cliente
  abrirModalNuevoCliente(): void {
    this.reiniciarFormularioCliente();
    this.showNuevoCliente = true;
    this.showEditarCliente = false;
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

    this.clientesService.nuevoCliente(data).subscribe(({ cliente }) => {
      this.clienteSeleccionado = cliente;
      this.clientes.unshift(cliente);
      this.showNuevoCliente = false;
      this.showOptionsClientes = false;
      this.filtro.parametroCliente = '';
      this.showEditarCliente = true;
      this.alertService.close();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  // Editando datos de obra
  editarObra(): void {

    // Verificacion: Codigo de obra
    if (this.codigo.trim() === "") {
      this.alertService.info('Debes colocar un código de obra');
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

    this.alertService.loading();

    const data = {
      codigo: this.codigo,
      descripcion: this.descripcion,
      direccion: this.direccion,
      fecha_inicio: this.fecha_inicio,
      fecha_finalizacion_estimada: this.fecha_finalizacion_estimada === '' ? '1970-01-01' : this.fecha_finalizacion_estimada,
      updatorUser: this.authService.usuario.userId,
    }

    this.obrasMaderaService.actualizarObra(this.idObra, data).subscribe({
      next: ({ obra }) => {
        this.obra = obra;
        this.showEditarObra = false;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Abrir - Editar datos de obra
  abrirEditarObra(): void {

    this.descripcion = this.obra.descripcion;
    this.direccion = this.obra.direccion;
    this.codigo = this.obra.codigo;
    this.fecha_inicio = format(new Date(this.obra.fecha_inicio), 'yyyy-MM-dd');

    // Manejo de fecha
    const fecha_finalizacion_estimada = format(new Date(this.obra.fecha_finalizacion_estimada), 'yyyy-MM-dd');
    this.fecha_finalizacion_estimada = fecha_finalizacion_estimada === '1970-01-01' ? '' : fecha_finalizacion_estimada;
    this.showEditarObra = true;

  }

  // Crear nuevo mueble
  nuevoMueble(): void {

    // Verificacion: Tipo de mueble
    if (this.tipoMueble === '') {
      this.alertService.info("Debe seleccionar un tipo de mueble");
      return;
    }

    // Verificacion: Precio de mueble
    if (this.mueblePrecio <= 0) {
      this.alertService.info("Debe colocar un precio para el mueble");
      return;
    }

    // Verificacion: Placas
    if (this.placas.length <= 0 && this.muebleConPlaca) {
      this.alertService.info("Debe colocar al menos una placa");
      return;
    }

    this.alertService.question({ msg: '¿Quieres agregar el mueble?', buttonText: 'Agregar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {

          this.alertService.loading();

          const data = {
            tipo_mueble: this.tipoMueble,
            obra_madera: this.idObra,
            placas: this.muebleConPlaca ? this.placas : [],
            precio: this.mueblePrecio,
            observaciones: this.muebleObservaciones,
            creatorUser: this.authService.usuario.userId,
            updatorUser: this.authService.usuario.userId,
          };

          this.mueblesService.nuevoMueble(data).subscribe({
            next: ({ mueble, precio_obra }) => {
              this.tipoMueble = '';
              this.muebleObservaciones = '';
              this.showSeccionPlacas = false;
              this.placas = [];
              this.showNuevoMueble = false;
              this.obra.precio = precio_obra;
              this.muebles.unshift(mueble);
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });

  }

  // Abrir - Nuevo mueble
  abrirNuevoMueble(): void {
    this.alertService.loading();
    this.formularioMueble = 'Crear';
    this.placas = [];
    this.tiposMueblesService.listarTipos().subscribe({
      next: ({ tipos }) => {
        this.tiposMuebles = tipos;
        this.muebleObservaciones = '';
        this.mueblePrecio = null!;
        this.tipoMueble = '';
        this.showNuevoMueble = true;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Editar mueble
  editarMueble(): void {

    // Verificacion: Tipo de mueble
    if (this.tipoMueble === '') {
      this.alertService.info("Debe seleccionar un tipo de mueble");
      return;
    }

    // Verificacion: Precio de mueble
    if (this.mueblePrecio <= 0) {
      this.alertService.info("Debe colocar un precio para el mueble");
      return;
    }

    this.alertService.loading();

    const data = {
      tipo_mueble: this.tipoMueble,
      precio: this.mueblePrecio,
      muebleConPlacas: this.muebleConPlaca,
      observaciones: this.muebleObservaciones,
      updatorUser: this.authService.usuario.userId,
    };

    this.mueblesService.actualizarMueble(this.muebleSeleccionado.id, data).subscribe({
      next: ({ mueble, precio_obra }) => {
        console.log(this.muebleSeleccionado);
        this.muebleSeleccionado.observaciones = mueble.observaciones;
        this.muebleSeleccionado.tipo_mueble = mueble.tipo_mueble;
        this.muebleSeleccionado.precio = mueble.precio;
        this.showNuevoMueble = false;
        this.obra.precio = precio_obra;
        if (!this.muebleConPlaca) this.muebleSeleccionado.muebles_placas = [];
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Abrir - Editar mueble
  abrirEditarMueble(mueble: any): void {
    this.alertService.loading();
    this.formularioMueble = 'Editar';
    this.muebleConPlaca = mueble.tipo_mueble.placas;
    this.tiposMueblesService.listarTipos().subscribe({
      next: ({ tipos }) => {
        this.tiposMuebles = tipos;
        this.showNuevoMueble = true;
        this.muebleSeleccionado = mueble;
        this.muebleObservaciones = this.muebleSeleccionado.observaciones;
        this.mueblePrecio = this.muebleSeleccionado.precio;
        this.tipoMueble = this.muebleSeleccionado.tipo_mueble.id;
        this.showNuevoMueble = true;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Eliminar obra
  eliminarObra(): void {
    this.alertService.question({ msg: '¿Quieres eliminar la obra?', buttonText: 'Eliminar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.obrasMaderaService.eliminarObra(this.idObra).subscribe({
            next: () => {
              this.router.navigateByUrl('/dashboard/obras-madera');
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  // Eliminar mueble
  eliminarMueble(): void {
    this.alertService.question({ msg: '¿Quieres eliminar el mueble?', buttonText: 'Eliminar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.mueblesService.eliminarMueble(this.muebleSeleccionado.id).subscribe({
            next: ({ precio_obra }) => {
              this.muebles = this.muebles.filter(mueble => mueble.id !== this.muebleSeleccionado.id);
              this.obra.precio = precio_obra;
              this.showNuevoMueble = false;
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  // Pase de obra -> Atras
  paseAtrasObra(): void {

    // Verificacion: Motivo de pase
    if (this.paseMotivo === '') {
      this.alertService.info('Debe colocar un motivo de pase');
      return;
    }

    this.alertService.question({ msg: `¿Quieres regresar la obra a ${this.proximaEtapa}?`, buttonText: 'Generar pase' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {

          this.alertService.loading();

          const data = {
            obra_madera: this.obra.id,
            tipo: 'Atras',
            observacion: this.paseObservacion,
            motivo: this.paseMotivo,
            etapa_anterior: this.obra?.estado,
            etapa_actual: this.proximaEtapa,
            creatorUser: this.authService.usuario.userId,
            updatorUser: this.authService.usuario.userId,
          };

          this.obrasMaderaPasesService.nuevoPase(data).subscribe({
            next: ({ pase }) => {
              this.obra.estado = this.proximaEtapa;
              this.pases.unshift(pase);
              this.showPaseAtras = false;
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });
  }

  // Pase de obra -> Adelante
  paseAdelanteObra(): void {

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
              this.obra.estado = proximaEtapa;
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });
  }

  // Abrir pase atras
  abrirPaseAtras(): void {

    this.alertService.loading();
    this.paseMotivo = '';
    this.paseObservacion = '';

    // Arreglo de etapas de regreso
    this.etapasRegreso = [];
    if (this.obra.estado === 'Finalizada') this.etapasRegreso = ['Colocacion', 'Produccion', 'Pendiente']
    else if (this.obra.estado === 'Colocacion') this.etapasRegreso = ['Produccion', 'Pendiente']
    else { // Esta en produccion
      this.etapasRegreso = ['Pendiente']
    }

    this.proximaEtapa = this.etapasRegreso[0];

    this.motivosPasesService.listarMotivos().subscribe({
      next: ({ motivos }) => {
        this.motivos = motivos.filter((motivo: any) => motivo.activo);
        this.showPaseAtras = true;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Abrir historial de pases
  abrirHistorialPases(): void {
    this.alertService.loading();
    const data = {
      columna: 'createdAt',
      direccion: 1,
      obra_madera: this.obra.id
    };
    this.obrasMaderaPasesService.listarPases(data).subscribe({
      next: ({ pases }) => {
        this.pases = pases;
        this.showContenidoSeccion = 'Historial_Pases';
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  }

  // Abrir -> Seccion de placas
  abrirSeccionPlacas(): void {

    // Verificacion: Tipo de mueble
    if (this.tipoMueble === '') {
      this.alertService.info("Debe seleccionar un tipo de mueble");
      return;
    }

    // Verificacion: Precio de mueble
    if (this.mueblePrecio <= 0) {
      this.alertService.info("Debe colocar un precio para el mueble");
      return;
    }

    this.alertService.loading();
    this.tiposPlacasService.listarTipos().subscribe({
      next: ({ tipos }) => {

        this.listadoTiposPlacas = tipos;

        if (this.formularioMueble === 'Editar') {
          this.placas = [];
          this.muebleSeleccionado.muebles_placas.map((placa: any) => {
            this.placas.push({
              id: placa.id,
              tipo_placa_madera: placa.tipo_placa_madera.id,
              tipo_placa_madera_codigo: placa.tipo_placa_madera.codigo,
              tipo_placa_madera_descripcion: placa.tipo_placa_madera.descripcion,
              cantidad: placa.cantidad
            })
          });
        }
    
        this.filtro.parametroPlaca = ''; 
        this.showBusquedaPlacas = false;   
        this.showSeccionPlacas = true;
        this.showNuevoMueble = false;

        this.alertService.close();
      }, error: ({error}) => this.alertService.errorApi(error.message)
    });

  }

  // Abrir orden mantenimiento
  abrirOrdenMantenimiento(accion: string, orden?: OrdenMantenimientoMadera): void {
    this.estadoFormularioOrden = accion;
    this.ordenMantenmientoSeleccionada = orden!;
    this.reiniciarFormularioOrdenMantenimiento();
    if(accion === 'editar') {
      const dataOrden: any = { ...orden, fecha: format(new Date(orden!.fecha), 'yyyy-MM-dd') };
      console.log(dataOrden);
      this.dataOrdenMantenimiento = dataOrden;
    }
    this.showModalOrdenMantenimiento = true;
  }

  nuevaOrdenMantenimiento(): void {

    const { fecha } = this.dataOrdenMantenimiento;

    // Validaciones
    if (!fecha) {
      this.alertService.info('Debe colocar una fecha');
      return;
    }

    // Generacion de la nueva orden
    this.alertService.question({ msg: '¿Generar orden de mantenimiento?', buttonText: 'Generar' })
    .then(({ isConfirmed }: any) => {
      if (isConfirmed) {
        this.alertService.loading();
        this.ordenesMantenimientoService.nuevaOrden(this.dataOrdenMantenimiento).subscribe({
          next: ({ orden }) => {
            this.alertService.close();
            this.ordenesMantenimiento.unshift(orden);
            this.reiniciarFormularioOrdenMantenimiento();
            this.showModalOrdenMantenimiento = false;
            window.open(`${baseUrl}/ordenes-mantenimiento-madera/imprimir/${orden.id}`)
          }, error: ({ error }) => this.alertService.errorApi(error.message)
        })
      }
    });

  }

  actualizarOrdenMantenimiento(): void {
    this.alertService.question({ msg: '¿Quieres actualizar la orden?', buttonText: 'Actualizar' })
    .then(({ isConfirmed }: any) => {
      if (isConfirmed) {
        
        this.alertService.loading();

        const { fecha, precio, observaciones } = this.dataOrdenMantenimiento;
        
        const data = {
          fecha,
          precio,
          observaciones,
          updatorUser: this.authService.usuario.userId
        }

        this.ordenesMantenimientoService.actualizarOrden(this.ordenMantenmientoSeleccionada.id!, data).subscribe({
          next: ({ orden }) => {
            this.ordenMantenmientoSeleccionada.fecha = orden.fecha;
            this.ordenMantenmientoSeleccionada.precio = orden.precio;
            this.ordenMantenmientoSeleccionada.observaciones = orden.observaciones;
            this.showModalOrdenMantenimiento = false;
            this.alertService.close();
          }, error: (error) => this.alertService.errorApi(error.message)
        })
      }
    });
  }

  eliminarOrdenMantenimiento(): void {
    this.alertService.question({ msg: '¿Quieres eliminar la orden?', buttonText: 'Eliminar' })
    .then(({ isConfirmed }: any) => {
      if (isConfirmed) {
        this.alertService.loading();
        const { id = 0 } = this.ordenMantenmientoSeleccionada;
        this.ordenesMantenimientoService.eliminarOrden(id).subscribe({
          next: () => {
            this.ordenesMantenimiento = this.ordenesMantenimiento.filter( orden => orden.id !== id );
            this.showModalOrdenMantenimiento = false;
            this.alertService.close();
          }, error: ({ error }) => this.alertService.errorApi(error.message)
        })
      }
    });
  }

  // Buscar placas
  buscarPlacas(): void {

    if (this.filtro.parametroPlaca === '') {
      this.alertService.info('Debe colocar un parametro de busqueda');
      return;
    }

    this.alertService.loading();
    this.tiposPlacasService.listarTipos({
      parametro: this.filtro.parametroPlaca,
      columna: 'descripcion',
      direccion: 1
    }).subscribe({
      next: ({ tipos }) => {
        this.listadoTiposPlacas = tipos;
        this.showBusquedaPlacas = true;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  cerrarBusquedaPlacas(): void {
    // this.listadoTiposPlacas = [];
    this.showBusquedaPlacas = false;
  }

  // Seleccionando tipo de placa
  seleccionarTipoPlaca(tipoPlaca: any): void {
    this.cantidadPlacas = null!;
    this.tipoPlacaSeleccionado = tipoPlaca;
    // this.listadoTiposPlacas = [];
  }

  // Agregar placa
  agregarPlaca(): void {

    if (this.cantidadPlacas <= 0) {
      this.alertService.info('Debe colocar una cantidad válida');
      return;
    }

    let tipoRepetido = false;

    // Tipo de placa repetido
    this.placas.map(placa => {
      if (placa.tipo_placa_madera === this.tipoPlacaSeleccionado.id) tipoRepetido = true;
    })

    if (tipoRepetido) {
      this.alertService.info('El tipo de placa ya se encuentra cargado');
      return;
    }

    this.placas.unshift({
      tipo_placa_madera: this.tipoPlacaSeleccionado.id,
      tipo_placa_madera_codigo: this.tipoPlacaSeleccionado.codigo,
      tipo_placa_madera_descripcion: this.tipoPlacaSeleccionado.descripcion,
      cantidad: this.cantidadPlacas
    });

    this.filtro.parametroPlaca = '';
    this.tipoPlacaSeleccionado = null;
    this.showBusquedaPlacas = false;
    this.cantidadPlacas = null!;

  }

  // Agregar placa -> Editando
  agregarPlacaEditando(): void {

    if (this.cantidadPlacas <= 0) {
      this.alertService.info('Debe colocar una cantidad válida');
      return;
    }

    let tipoRepetido = false;

    // Tipo de placa repetido
    this.placas.map(placa => {
      if (placa.tipo_placa_madera === this.tipoPlacaSeleccionado.id) tipoRepetido = true;
    })

    if (tipoRepetido) {
      this.alertService.info('El tipo de placa ya se encuentra cargado');
      return;
    }


    this.alertService.question({ msg: '¿Quieres agregar esta placa?', buttonText: 'Agregar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {

          const data = {
            mueble: this.muebleSeleccionado.id,
            cantidad: this.cantidadPlacas,
            tipo_placa_madera: this.tipoPlacaSeleccionado.id,
            creatorUser: this.authService.usuario.userId,
            updatorUser: this.authService.usuario.userId
          }

          this.alertService.loading();
          this.mueblesPlacasService.nuevaRelacion(data).subscribe({
            next: ({ relacion }) => {

              this.placas.unshift({
                id: relacion.id,
                tipo_placa_madera: this.tipoPlacaSeleccionado.id,
                tipo_placa_madera_codigo: this.tipoPlacaSeleccionado.codigo,
                tipo_placa_madera_descripcion: this.tipoPlacaSeleccionado.descripcion,
                cantidad: this.cantidadPlacas
              });

              this.muebleSeleccionado.muebles_placas.unshift(relacion);

              this.filtro.parametroPlaca = '';
              this.tipoPlacaSeleccionado = null;
              this.showBusquedaPlacas = false;
              this.cantidadPlacas = null!;

              this.alertService.close();

            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });

  }


  // Eliminar placa
  eliminarPlaca(idTipoPlaca: number): void {
    this.placas = this.placas.filter(placa => placa.tipo_placa_madera !== idTipoPlaca);
  }

  // Eliminar - Editando
  eliminarPlacaEditando(id: number): void {

    this.alertService.question({ msg: '¿Quieres eliminar la placa?', buttonText: 'Eliminar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.mueblesPlacasService.eliminarRelacion(id).subscribe({
            next: () => {
              this.placas = this.placas.filter(placa => placa.id !== id);
              this.muebleSeleccionado.muebles_placas = this.muebleSeleccionado.muebles_placas.filter((placa: any) => placa.id !== id);
              this.alertService.close();
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });

  }

  // Nuevo tipo de placa
  nuevoTipoPlaca(): void {

    // Verificacion: Codigo vacio
    if (this.codigoPlaca.trim() === "") {
      this.alertService.info('Debes colocar un código');
      return;
    }

    // Verificacion: Descripcion vacia
    if (this.descripcionPlaca.trim() === "") {
      this.alertService.info('Debes colocar una descripción');
      return;
    }

    this.alertService.loading();

    const data = {
      codigo: this.codigoPlaca,
      descripcion: this.descripcionPlaca,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.tiposPlacasService.nuevoTipo(data).subscribe(({ tipo }) => {
      this.tipoPlacaSeleccionado = tipo;
      this.showModalTipoPlaca = false;
      this.showSeccionPlacas = true;
      this.alertService.close();
    }, ({ error }) => {
      this.alertService.errorApi(error.message);
    });

  }

  conSinPlaca(): void {
    this.muebleConPlaca = this.tiposMuebles.find(tipo => tipo.id == this.tipoMueble).placas;
  }

  // Imprimir oden de mantenimiento
  imprimirOrdenMantenimiento(): void {
    this.alertService.question({ msg: '¿Imprimir orden de mantenimiento?', buttonText: 'Imprimir' })
    .then(({ isConfirmed }: any) => {
      if (isConfirmed) {
        this.alertService.loading();
        window.open(`${baseUrl}/ordenes-mantenimiento-madera/imprimir/${this.ordenMantenmientoSeleccionada.id}`, '_blank');
        this.showModalOrdenMantenimiento = false;
        this.alertService.close();
        // this.ordenesMantenimientoService.imprimirOrden(this.ordenMantenmientoSeleccionada.id).subscribe({
        // next: (resp) => {
        //   console.log(resp);
        //   this.showModalOrdenMantenimiento = false;
        //   this.alertService.close();
        //   }, error: ({ error }) => this.alertService.errorApi(error.message)
        // })
      }
    });
  }

  // Abrir -> Nuevo tipo de placa
  abrirNuevoTipoPlaca(): void {
    this.codigoPlaca = '';
    this.descripcionPlaca = '';
    this.showModalTipoPlaca = true;
    this.showBusquedaPlacas = false;
    // this.listadoTiposPlacas = [];
    this.showSeccionPlacas = false;
  }

  // Abrir -> Nuevo tipo de placa
  regresarSeccionPlacas(): void {
    this.showModalTipoPlaca = false;
    this.showSeccionPlacas = true;
  }

  // Regresar -> Seccion nuevo mueble
  regresarNuevoMueble(): void {
    this.showSeccionPlacas = false;
    this.showNuevoMueble = true;
  }

  // Regresar a editar cliente
  regresarEditarCliente(): void {
    this.showNuevoCliente = false;
    this.showEditarCliente = true;
    this.showOptionsClientes = false;
    this.filtro.parametroCliente = '';
  }

  // Cancelar seleccionar placa
  cancelarSeleccionarPlaca(): void {
    this.tipoPlacaSeleccionado = null;
    this.showBusquedaPlacas = false;
  }

  // Reiniciar formulario -> Cliente
  reiniciarFormularioCliente(): void {
    this.descripcion_cliente = ''; // Razon social
    this.tipo_identificacion = 'DNI';
    this.identificacion = '';
    this.telefono = '';
    this.direccion_cliente = '';
    this.email = '';
  }

  // Reniciar formulario -> Orden de mantenimiento
  reiniciarFormularioOrdenMantenimiento(): void {
    this.dataOrdenMantenimiento = {
      obra_madera: this.idObra,
      fecha: format(new Date(), 'yyyy-MM-dd'),
      observaciones: '',
      precio: null,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }
  }

}
