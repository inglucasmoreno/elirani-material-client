import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-modal-clientes',
  templateUrl: './modal-clientes.component.html',
  styleUrls: ['./modal-clientes.component.scss']
})
export class ModalClientesComponent {

  public dataOutput = {
    id: 0,
    descripcion: '',
    tipo_identificacion: 'DNI',
    identificacion: '',
    telefono: '',
    direccion: '',
    activo: true
  }

  constructor(
    private authService: AuthService,
    private clientesService: ClientesService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalClientesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
    console.log(this.dataOutput);
  }

  // Nuevo cliente
  crearCliente(): void {

    const { descripcion, telefono } = this.dataOutput;

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
      ...this.dataOutput,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.clientesService.nuevoCliente(data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Actualizar cliente
  actualizarCliente(): void {

    const { id, descripcion, telefono } = this.dataOutput;

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
      ...this.dataOutput,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.clientesService.actualizarCliente(id, data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

}
