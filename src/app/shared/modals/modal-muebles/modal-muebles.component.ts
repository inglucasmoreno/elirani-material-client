import { Component, Inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MueblesService } from 'src/app/services/muebles.service';
import { TiposMueblesService } from 'src/app/services/tipos-muebles.service';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TiposPlacasMaderaService } from '../../../services/tipos-placas-madera.service';

@Component({
  selector: 'app-modal-muebles',
  templateUrl: './modal-muebles.component.html',
  styleUrls: ['./modal-muebles.component.scss']
})
export class ModalMueblesComponent {

  public tipos_muebles: any[] = [];
  public tipos_placas: any[] = [];
  public tipoSeleccionado: any = null;
  public placas: any[] = [];
  public muebleConPlacas: boolean = false;

  public showEtapa = 'Mueble'; // Mueble o Placas

  public dataOutput = {
    id: 0,
    obra_madera: 0,
    tipo_mueble: null,
    precio: null,
    observaciones: '',
  }

  public dataPlacaTipo = {
    id: null,
    cantidad: null
  }

  constructor(
    private authService: AuthService,
    private mueblesService: MueblesService,
    private tiposPlacasMaderaService: TiposPlacasMaderaService,
    private tiposMueblesService: TiposMueblesService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalMueblesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
    this.inicializacion();
  }

  inicializacion(): void {
    this.alertService.loading();
    this.tiposMueblesService.listarTipos({ activo: true }).subscribe({
      next: ({ tipos }) => {
        this.tipos_muebles = tipos;
        this.tiposPlacasMaderaService.listarTipos({ columna: 'descripcion', direccion: 1 }).subscribe({
          next: ({ tipos }) => {
            this.tipos_placas = tipos;
            this.alertService.close();
          }, error: ({ error }) => this.alertService.errorApi(error.message)
        })
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  // Nuevo mueble
  crearMueble(): void {

    const { tipo_mueble, precio } = this.dataOutput;

    // DATOS DE MUEBLE

    // Verificacion: Tipo de mueble
    if (!tipo_mueble || tipo_mueble === "") {
      this.alertService.info('Debes seleccionar un tipo de mueble');
      return;
    }

    // Verificacion: Precio
    if (!precio || precio === 0) {
      this.alertService.info('Debes colocar un precio');
      return;
    }

    // DATOS DE PLACAS
    if (this.muebleConPlacas && this.placas.length === 0) {
      this.alertService.info('Debe agregar al menos una placa');
      return;
    }

    const data = {
      tipo_mueble: this.dataOutput.tipo_mueble,
      obra_madera: this.dataOutput.obra_madera,
      precio: this.dataOutput.precio,
      placas: this.placas,
      observaciones: this.dataOutput.observaciones,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.mueblesService.nuevoMueble(data).subscribe({
      next: ({ mueble }) => {
        this.dialogRef.close({
          accion: 'Crear',
          mueble
        });
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Eliminar mueble
  eliminarMueble(): void {
    this.alertService.question({ msg: `Eliminando mueble`, buttonText: 'Eliminar' })
      .then(({ isConfirmed }: any) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.mueblesService.eliminarMueble(this.dataOutput.id).subscribe({
            next: () => {
              this.dialogRef.close({
                accion: 'Eliminar',
                idMueble: this.dataOutput.id
              });
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  // Actualizar mueble
  actualizarMueble(): void {

    const { tipo_mueble, precio } = this.dataOutput;

    // Verificacion: Tipo de mueble
    if (!tipo_mueble || tipo_mueble === "") {
      this.alertService.info('Debes seleccionar un tipo de mueble');
      return;
    }

    // Verificacion: Precio
    if (!precio || precio === 0) {
      this.alertService.info('Debes colocar un precio');
      return;
    }

    const data = {
      tipo_mueble: this.dataOutput.tipo_mueble,
      obra_madera: this.dataOutput.obra_madera,
      precio: this.dataOutput.precio,
      observaciones: this.dataOutput.observaciones,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.mueblesService.actualizarMueble(this.dataOutput.id, data).subscribe({
      next: ({ mueble }) => {
        this.dialogRef.close({
          accion: 'Editar',
          mueble
        });
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })

  }

  // Seleccionar tipo mueble
  seleccionarTipoMueble(): void {
    const { placas } = this.tipos_muebles.find(tipo => tipo.id === this.dataOutput.tipo_mueble)
    this.muebleConPlacas = placas;
    this.placas = [];
  }

  // Agregar placa
  agregarPlaca(): void {

    if (!this.dataPlacaTipo.id) {
      this.alertService.info('Debe seleccionar un tipo de placa');
      return;
    }

    if (!this.dataPlacaTipo.cantidad || this.dataPlacaTipo.cantidad <= 0) {
      this.alertService.info('Debe colocar una cantidad válida');
      return;
    }

    let tipoRepetido = false;

    // Tipo de placa repetido
    this.placas.map(placa => {
      if (placa.tipo_placa_madera === this.dataPlacaTipo.id) tipoRepetido = true;
    })

    if (tipoRepetido) {
      this.alertService.info('El tipo de placa ya se encuentra cargado');
      return;
    }

    const placaSeleccionada = this.tipos_placas.find(tipo => tipo.id === this.dataPlacaTipo.id)

    this.placas.unshift({
      tipo_placa_madera: placaSeleccionada.id,
      tipo_placa_madera_codigo: placaSeleccionada.codigo,
      tipo_placa_madera_descripcion: placaSeleccionada.descripcion,
      cantidad: this.dataPlacaTipo.cantidad
    });

    this.dataPlacaTipo.id = null;
    this.dataPlacaTipo.cantidad = null;

  }

  cambiarEtapa(etapa: string): void {

    const { tipo_mueble, precio } = this.dataOutput;

    if (etapa === 'Placas') {
      // Verificacion: Tipo de mueble
      if (!tipo_mueble || tipo_mueble === "") {
        this.alertService.info('Debes seleccionar un tipo de mueble');
        return;
      }

      // Verificacion: Precio
      if (!precio || precio === 0) {
        this.alertService.info('Debes colocar un precio');
        return;
      }
    }

    this.showEtapa = etapa;

  }

  eliminarPlaca(placa: any): void {
    this.placas = this.placas.filter( elemento => elemento.tipo_placa_madera !== placa.tipo_placa_madera );
    console.log(placa);
  }


}
