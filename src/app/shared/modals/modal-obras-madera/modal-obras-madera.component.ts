import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { ObrasMaderaService } from 'src/app/services/obras-madera.service';

@Component({
  selector: 'app-modal-obras-madera',
  templateUrl: './modal-obras-madera.component.html',
  styleUrls: ['./modal-obras-madera.component.scss']
})
export class ModalObrasMaderaComponent {

  public estadoModal: 'Obra' | 'Cliente' = 'Obra'
  public clientes: any[] = [];

  public dataOutput = {
    id: 0,
    cliente: null,
    codigo: '',
    fecha_inicio: new Date(),
    fecha_finalizacion_estimada: '',
    direccion: '',
    descripcion: '',
    activo: true
  }

  public formCliente = {
    id: 0,
    descripcion: '',
    tipo_identificacion: 'DNI',
    identificacion: '',
    telefono: '',
    direccion: '',
    activo: true
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private obrasMaderaService: ObrasMaderaService,
    private clientesService: ClientesService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalObrasMaderaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
    this.inicializacion();
  }

  inicializacion(): void {
    this.alertService.loading();
    this.clientesService.listarClientes({ activo: true }).subscribe({
      next: ({ clientes }) => {
        this.clientes = clientes;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // - OBRA

  crearObra(): void {

    const { codigo, cliente, fecha_inicio, direccion } = this.dataOutput;

    // Verificacion: Cliente
    if (!cliente || cliente === 0) {
      this.alertService.info('Debes seleccionar un cliente');
      return;
    }

    // Verificacion: Código de obra
    if (codigo.trim() === "") {
      this.alertService.info('Debes colocar el código de obra');
      return;
    }

    // Verificacion: fecha de inicio
    if (!fecha_inicio) {
      this.alertService.info('Debes colocar una fecha de inicio');
      return;
    }

    // Verificacion: direccion
    if (direccion.trim() === "") {
      this.alertService.info('Debes colocar una dirección');
      return;
    }

    const data = {
      descripcion: this.dataOutput.descripcion,
      codigo: this.dataOutput.codigo,
      cliente: this.dataOutput.cliente,
      direccion: this.dataOutput.direccion,
      fecha_inicio: format(this.dataOutput.fecha_inicio, 'yyyy-MM-dd'),
      fecha_finalizacion_estimada: this.dataOutput.fecha_finalizacion_estimada === '' ? '1970-01-01' : format(new Date(this.dataOutput.fecha_finalizacion_estimada), 'yyyy-MM-dd'),
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.obrasMaderaService.nuevaObra(data).subscribe({
      next: ({ obra }) => {
        this.dialogRef.close();
        this.router.navigateByUrl(`/dashboard/obras-madera/detalles/${obra.id}`)
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Actualizar obra
  actualizarObra(): void {

    const { id, codigo, cliente, fecha_inicio, direccion } = this.dataOutput;

    // Verificacion: Cliente
    if (!cliente || cliente === 0) {
      this.alertService.info('Debes seleccionar un cliente');
      return;
    }

    // Verificacion: Código de obra
    if (codigo.trim() === "") {
      this.alertService.info('Debes colocar el código de obra');
      return;
    }

    // Verificacion: fecha de inicio
    if (!fecha_inicio) {
      this.alertService.info('Debes colocar una fecha de inicio');
      return;
    }

    // Verificacion: direccion
    if (direccion.trim() === "") {
      this.alertService.info('Debes colocar una dirección');
      return;
    }

    const data = {
      descripcion: this.dataOutput.descripcion,
      codigo: this.dataOutput.codigo,
      cliente: this.dataOutput.cliente,
      direccion: this.dataOutput.direccion,
      fecha_inicio: format(this.dataOutput.fecha_inicio, 'yyyy-MM-dd'),
      fecha_finalizacion_estimada: this.dataOutput.fecha_finalizacion_estimada === '' ? '1970-01-01' : format(new Date(this.dataOutput.fecha_finalizacion_estimada), 'yyyy-MM-dd'),
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.obrasMaderaService.actualizarObra(id, data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  accionFormularioObra(): void {
    if(this.dataInput.accion === 'Crear') this.crearObra();
    else if(this.dataInput.accion === 'Editar') this.actualizarObra();
  }

  // - CLIENTES

  crearCliente(): void {

    const { descripcion, telefono } = this.formCliente;

    // Verificar: Descripcion
    if (descripcion.trim() === '') {
      this.alertService.info('Debe colocar un nombre o razon social');
      return;
    }

    // Verificar: Telefono
    if (telefono.trim() === '') {
      this.alertService.info('Debe colocar un número de teléfono');
      return;
    }

    const data = {
      ...this.formCliente,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.clientesService.nuevoCliente(data).subscribe({
      next: ({ cliente }) => {
        this.clientes.unshift(cliente);
        this.dataOutput.cliente = cliente.id;
        this.reiniciarFormularioClientes();
        this.cambiarEstadoModal('Obra');
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  reiniciarFormularioClientes(): void {
    this.formCliente = {
      id: 0,
      descripcion: '',
      tipo_identificacion: 'DNI',
      identificacion: '',
      telefono: '',
      direccion: '',
      activo: true
    }
  }

  // Cambio de estado - Formulario

  cambiarEstadoModal(estado: 'Obra' | 'Cliente'): void {
    this.estadoModal = estado;
  }

}
