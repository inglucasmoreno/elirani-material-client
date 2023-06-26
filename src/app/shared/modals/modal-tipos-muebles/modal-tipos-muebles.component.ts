import { Component, Inject } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { TiposMueblesService } from 'src/app/services/tipos-muebles.service';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-modal-tipos-muebles',
  templateUrl: './modal-tipos-muebles.component.html',
  styleUrls: ['./modal-tipos-muebles.component.scss']
})
export class ModalTiposMueblesComponent {
  
  public dataOutput = {
    id: 0,
    descripcion: '',
    placas: true,
    activo: true
  }

  constructor(
    private authService: AuthService,
    private tiposService: TiposMueblesService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalTiposMueblesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) {}

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
  }

  // Nuevo tipo
  crearTipo(): void {

    const { descripcion } = this.dataOutput;

    // Verificar: Descripcion
    if(descripcion.trim() === '') {
      this.alertService.info('Debe colocar una descripción');
      return;
    }

    const data = {
      ...this.dataOutput,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.tiposService.nuevoTipo(data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Actualizar tipo
  actualizarTipo(): void {

    const { id, descripcion } = this.dataOutput;

    // Verificar: Descripcion
    if(descripcion.trim() === '') {
      this.alertService.info('Debe colocar una descripción');
      return;
    }

    const data = {
      ...this.dataOutput,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.tiposService.actualizarTipo(id, data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

}
