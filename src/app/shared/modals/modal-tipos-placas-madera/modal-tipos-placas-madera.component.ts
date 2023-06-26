import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TiposPlacasMaderaService } from '../../../services/tipos-placas-madera.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modal-tipos-placas-madera',
  templateUrl: './modal-tipos-placas-madera.component.html',
  styleUrls: ['./modal-tipos-placas-madera.component.scss']
})
export class ModalTiposPlacasMaderaComponent {
  
  public dataOutput = {
    id: 0,
    codigo: '',
    descripcion: '',
    activo: true
  }

  constructor(
    private authService: AuthService,
    private tiposService: TiposPlacasMaderaService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalTiposPlacasMaderaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) {}

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
  }

  // Nuevo tipo
  crearTipo(): void {

    const { codigo, descripcion } = this.dataOutput;

    // Verificar: Codigo
    if(codigo.trim() === '') {
      this.alertService.info('Debe colocar un código');
      return;
    }

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

    const { id, codigo, descripcion } = this.dataOutput;

    // Verificar: Codigo
    if(codigo.trim() === '') {
      this.alertService.info('Debe colocar un código');
      return;
    }

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
