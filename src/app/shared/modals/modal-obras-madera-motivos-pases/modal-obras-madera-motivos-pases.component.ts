import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ObrasMaderaMotivosPasesService } from 'src/app/services/obras-madera-motivos-pases.service';

@Component({
  selector: 'app-modal-obras-madera-motivos-pases',
  templateUrl: './modal-obras-madera-motivos-pases.component.html',
  styleUrls: ['./modal-obras-madera-motivos-pases.component.scss']
})
export class ModalObrasMaderaMotivosPasesComponent {

  public dataOutput = {
    id: 0,
    descripcion: '',
    activo: true
  }

  constructor(
    private authService: AuthService,
    private motivosService: ObrasMaderaMotivosPasesService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalObrasMaderaMotivosPasesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
  }

  // Nuevo motivo
  crearMotivo(): void {

    const { descripcion } = this.dataOutput;

    // Verificar: Descripcion
    if (descripcion.trim() === '') {
      this.alertService.info('Debe colocar una descripción');
      return;
    }

    const data = {
      ...this.dataOutput,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.motivosService.nuevoMotivo(data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Actualizar motivo
  actualizarMotivo(): void {

    const { id, descripcion } = this.dataOutput;

    // Verificar: Descripcion
    if (descripcion.trim() === '') {
      this.alertService.info('Debe colocar una descripción');
      return;
    }

    const data = {
      ...this.dataOutput,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.motivosService.actualizarMotivo(id, data).subscribe({
      next: () => {
        this.dialogRef.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

}
