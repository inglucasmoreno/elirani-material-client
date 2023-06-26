import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ObrasMaderaService } from 'src/app/services/obras-madera.service';
import { OrdenesMantenimientoMaderaService } from 'src/app/services/ordenes-mantenimiento-madera.service';
import { environment } from 'src/environments/environments';

const baseUrl = environment.base_url;

@Component({
  selector: 'app-modal-ordenes-mantenimiento',
  templateUrl: './modal-ordenes-mantenimiento.component.html',
  styleUrls: ['./modal-ordenes-mantenimiento.component.scss']
})
export class ModalOrdenesMantenimientoComponent {

  // Permisos totales
  public permisosTotales = ['OBRAS_MADERA_ALL'];

  public obras: any[] = [];
  public parametrosFijos: boolean = false;

  public dataOutput = {
    id: 0,
    obra_madera: '',
    fecha: '',
    observaciones: '',
    precio: null,
    activo: true
  }

  constructor(
    private authService: AuthService,
    private ordenesService: OrdenesMantenimientoMaderaService,
    private obrasMaderaService: ObrasMaderaService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalOrdenesMantenimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) {}

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
    this.parametrosFijos = this.dataInput.parametrosFijos;
    this.inicializacion();
  }

  inicializacion(): void {
    this.obrasMaderaService.listarObras().subscribe({
      next: ({ obras }) => {
        this.obras = obras;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })    
  }

  // Nueva orden
  crearOrden(): void {

    const { obra_madera, fecha } = this.dataOutput;


    // Verificaciones

    if(!obra_madera){
      this.alertService.info('Debe seleccionar una obra');
      return;
    }

    if(!fecha || fecha === ''){
      this.alertService.info('Debe seleccionar una fecha');
      return;
    }

    const data = {
      ...this.dataOutput,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.ordenesService.nuevaOrden(data).subscribe({
      next: ({ orden }) => {
        window.open(`${baseUrl}/ordenes-mantenimiento-madera/imprimir/${orden.id}`, '_blank');
        this.dialogRef.close({
          accion: 'Crear',
          orden
        });
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Actualizar orden
  actualizarOrden(): void {

    const { id, obra_madera, fecha } = this.dataOutput;

    // Verificaciones

    if(!obra_madera){
      this.alertService.info('Debe seleccionar una obra');
      return;
    }

    if(!fecha || fecha === ''){
      this.alertService.info('Debe seleccionar una fecha');
      return;
    }

    const data = {
      ...this.dataOutput,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.ordenesService.actualizarOrden(id, data).subscribe({
      next: ({ orden }) => {
        this.dialogRef.close({
          accion: 'Editar',
          orden
        });
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Eliminar orden
  eliminarOrden(): void {
    this.alertService.question({ msg: `¿Quieres eliminar la orden de mantenimiento?`, buttonText: 'Eliminar' })
    .then(({ isConfirmed }: any) => {
      if (isConfirmed) {
        this.alertService.loading();
        this.ordenesService.eliminarOrden(this.dataOutput.id).subscribe({
          next: () => {
            this.dialogRef.close({
              accion: 'Eliminar',
              idOrden: this.dataOutput.id
            })
          }, error: ({ error }) => this.alertService.errorApi(error.message)
        })
      }
    });
  }

  imprimirOrden(): void {
    this.alertService.question({ msg: '¿Imprimir orden de mantenimiento?', buttonText: 'Imprimir' })
    .then(({ isConfirmed }: any) => {
      if (isConfirmed) {
        this.alertService.loading();
        window.open(`${baseUrl}/ordenes-mantenimiento-madera/imprimir/${this.dataOutput.id}`, '_blank');
        this.alertService.close();
      }
    });
  }

}
