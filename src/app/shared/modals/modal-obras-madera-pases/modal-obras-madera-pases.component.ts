import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ObrasMaderaPasesService } from 'src/app/services/obras-madera-pases.service';
import { ObrasMaderaMotivosPasesService } from 'src/app/services/obras-madera-motivos-pases.service';

@Component({
  selector: 'app-modal-obras-madera-pases',
  templateUrl: './modal-obras-madera-pases.component.html',
  styleUrls: ['./modal-obras-madera-pases.component.scss']
})
export class ModalObrasMaderaPasesComponent {

  public listadoEtapas: string[] = [];
  public motivos: any[] = [];

  public dataOutput = {
    obra_madera: 0,
    tipo: '',
    etapa_actual: '',
    etapa_anterior: '',
    observacion: '',
    motivo: '',
    activo: true
  }

  constructor(
    private authService: AuthService,
    private obrasMaderaPasesService: ObrasMaderaPasesService,
    private obrasMaderaMotivosPasesService: ObrasMaderaMotivosPasesService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalObrasMaderaPasesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.dataOutput = this.dataInput.dataForm;
    this.generarListadoEtapas();
    this.inicializacion();
  }

  inicializacion(): void {
    this.obrasMaderaMotivosPasesService.listarMotivos({ activo: true }).subscribe({
      next: ({ motivos }) => {
        this.motivos = motivos;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Nuevo pase
  crearPase(): void {

    const { motivo, etapa_actual } = this.dataOutput;

    // Verificaciones
    if(!etapa_actual || etapa_actual.trim() === ''){
      this.alertService.info('Debe seleccionar una etapa');
      return; 
    }

    // Verificaciones
    if(!motivo){
      this.alertService.info('Debe seleccionar un motivo');
      return; 
    }

    const data = {
      ...this.dataOutput,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.obrasMaderaPasesService.nuevoPase(data).subscribe({
      next: () => {
        this.dialogRef.close(this.dataOutput);
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Listado de etapas
  generarListadoEtapas(): void {
    switch (this.dataOutput.etapa_anterior) {
      case 'Produccion':
        this.listadoEtapas = ['Pendiente'];
        break;
      case 'Colocacion':
        this.listadoEtapas = ['Produccion', 'Pendiente'];
        break;
      case 'Finalizada':
        this.listadoEtapas = ['Colocacion', 'Produccion', 'Pendiente'];
        break;
      default:
        break;
    }
    console.log(this.dataOutput.etapa_anterior);
    console.log(this.listadoEtapas);
  }


}
