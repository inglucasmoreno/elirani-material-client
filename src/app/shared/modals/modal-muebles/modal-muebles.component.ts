import { Component, Inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MueblesService } from 'src/app/services/muebles.service';
import { TiposMueblesService } from 'src/app/services/tipos-muebles.service';
import { AlertService } from 'src/app/services/alert.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TiposPlacasMaderaService } from '../../../services/tipos-placas-madera.service';
import { MueblesPlacasService } from '../../../services/muebles-placas.service';

@Component({
  selector: 'app-modal-muebles',
  templateUrl: './modal-muebles.component.html',
  styleUrls: ['./modal-muebles.component.scss']
})
export class ModalMueblesComponent {

  public estadoForm: 'Mueble' | 'TipoMueble' | 'TipoPlaca' = 'Mueble';
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
    placas: [],
  }

  public formTipoMueble = {
    id: 0,
    descripcion: '',
    placas: true,
    activo: true
  }

  public formTipoPlaca = {
    id: 0,
    codigo: '',
    descripcion: '',
    activo: true
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
    private mueblesPlacasService: MueblesPlacasService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<ModalMueblesComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInput: any,
  ) { }

  ngOnInit(): void {
    this.dataOutput = this.dataInput.dataForm;
    this.muebleConPlacas = this.dataInput.dataForm.muebleConPlacas;
    this.placas = this.dataInput.dataForm.placas;
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

  // - MUEBLE

  // Nuevo mueble
  crearMueble(): void {

    // Verificacion
    const { correcto, message } = this.verificacionDatos();

    if (!correcto) {
      this.alertService.info(message);
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

    // Verificacion
    const { correcto, message } = this.verificacionDatos();

    if (!correcto) {
      this.alertService.info(message);
      return;
    }

    const data = {
      tipo_mueble: this.dataOutput.tipo_mueble,
      obra_madera: this.dataOutput.obra_madera,
      muebleConPlacas: this.muebleConPlacas,
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
    if (this.dataInput.accion === 'Crear') this.placas = [];
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
      if (placa.tipo_placa_madera.id === this.dataPlacaTipo.id) tipoRepetido = true;
    })

    if (tipoRepetido) {
      this.alertService.info('El tipo de placa ya se encuentra cargado');
      return;
    }

    if (this.dataInput.accion === 'Crear') {

      const placaSeleccionada = this.tipos_placas.find(tipo => tipo.id === this.dataPlacaTipo.id)

      this.placas.unshift({
        tipo_placa_madera: placaSeleccionada.id,
        tipo_placa_madera_codigo: placaSeleccionada.codigo,
        tipo_placa_madera_descripcion: placaSeleccionada.descripcion,
        cantidad: this.dataPlacaTipo.cantidad
      });

      this.dataPlacaTipo.id = null;
      this.dataPlacaTipo.cantidad = null;

    } else {

      this.alertService.question({ msg: `Agregando placa`, buttonText: 'Agregar' })
        .then(({ isConfirmed }: any) => {
          if (isConfirmed) {

            this.alertService.loading();

            const data = {
              mueble: this.dataOutput.id,
              tipo_placa_madera: this.dataPlacaTipo.id,
              cantidad: this.dataPlacaTipo.cantidad,
              creatorUser: this.authService.usuario.userId,
              updatorUser: this.authService.usuario.userId
            };

            this.mueblesPlacasService.nuevaRelacion(data).subscribe({
              next: ({ relacion }) => {

                this.placas.unshift(relacion);

                this.dataPlacaTipo.id = null;
                this.dataPlacaTipo.cantidad = null;

                this.alertService.close();

              }, error: ({ error }) => this.alertService.errorApi(error.message)
            })
          }
        });

    }

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

    if (this.placas.length === 1) {
      this.alertService.info('El mueble no puede quedar sin placas');
      return;
    }

    if (this.dataInput.accion === 'Crear') {
      this.placas = this.placas.filter(elemento => elemento.tipo_placa_madera !== placa.tipo_placa_madera);
    } else {
      this.alertService.question({ msg: `Eliminando placa`, buttonText: 'Eliminar' })
        .then(({ isConfirmed }: any) => {
          if (isConfirmed) {
            this.alertService.loading();
            this.mueblesPlacasService.eliminarRelacion(placa.id).subscribe({
              next: () => {

                // this.placas = this.placas.filter(elemento => elemento.id !== placa.id);

                const indice = this.placas.findIndex(elemento => elemento.id === placa.id);
                this.placas.splice(indice, 1);
                this.alertService.close();

              }, error: ({ error }) => this.alertService.errorApi(error.message)
            })
          }
        });
    }
  }

  // Accion - Formulario
  accionFormulario(): void {

    if (this.dataInput.accion === 'Crear' && !this.muebleConPlacas) {
      this.crearMueble();
    } else if (this.dataInput.accion === 'Crear' && this.muebleConPlacas && this.showEtapa === 'Mueble') {
      this.cambiarEtapa('Placas');
    } else if (this.dataInput.accion === 'Crear' && this.muebleConPlacas && this.showEtapa === 'Placas') {
      this.crearMueble();
    } else if (this.dataInput.accion === 'Editar') {
      this.actualizarMueble();
    }

  }

  // Verificacion
  verificacionDatos(): { correcto: boolean, message: string } {

    const { tipo_mueble, precio } = this.dataOutput;

    // Verificacion: Tipo de mueble
    if (!tipo_mueble || tipo_mueble === "") {
      this.alertService.info('Debes seleccionar un tipo de mueble');
      return { correcto: false, message: 'Debes seleccionar un tipo de mueble' };
    }

    // Verificacion: Precio
    if (!precio || precio === 0) {
      return { correcto: false, message: 'Debes colocar un precio' };
    }

    // DATOS DE PLACAS
    if (this.muebleConPlacas && this.placas.length === 0) {
      this.alertService.info('Debe agregar al menos una placa');
      return { correcto: false, message: 'Debe agregar al menos una placa' };
    }

    return { correcto: true, message: 'Todo correcto' };

  }

  // - TIPO MUEBLE

  crearTipoMueble(): void {

    const { descripcion } = this.formTipoMueble;

    // Verificar: Descripcion
    if (descripcion.trim() === '') {
      this.alertService.info('Debe colocar una descripción');
      return;
    }

    const data = {
      ...this.formTipoMueble,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.tiposMueblesService.nuevoTipo(data).subscribe({
      next: ({ tipo }) => {
        this.tipos_muebles.unshift(tipo);
        this.muebleConPlacas = data.placas;
        this.dataOutput.tipo_mueble = tipo.id;
        this.reiniciarFormularioTipoMueble();
        this.estadoForm = 'Mueble';
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  reiniciarFormularioTipoMueble(): void {
    this.formTipoMueble = {
      id: 0,
      descripcion: '',
      placas: true,
      activo: true
    }
  }


  // - TIPO PLACA

  crearTipoPlaca(): void {

    const { codigo, descripcion } = this.formTipoPlaca;

    // Verificar: Codigo
    if (codigo.trim() === '') {
      this.alertService.info('Debe colocar un código');
      return;
    }

    // Verificar: Descripcion
    if (descripcion.trim() === '') {
      this.alertService.info('Debe colocar una descripción');
      return;
    }

    const data = {
      ...this.formTipoPlaca,
      creatorUser: this.authService.usuario.userId,
      updatorUser: this.authService.usuario.userId,
    }

    this.alertService.loading();

    this.tiposPlacasMaderaService.nuevoTipo(data).subscribe({
      next: ({tipo}) => {
        this.tipos_placas.unshift(tipo);
        this.dataPlacaTipo.id = tipo.id;
        this.reiniciarFormularioTipoPlaca();
        this.estadoForm = 'Mueble';
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  reiniciarFormularioTipoPlaca(): void {
    this.formTipoPlaca = {
      id: 0,
      codigo: '',
      descripcion: '',
      activo: true
    }
  }

  cambiarEstado(estado: 'Mueble' | 'TipoMueble' | 'TipoPlaca'): void {
    this.estadoForm = estado;
  }


}
