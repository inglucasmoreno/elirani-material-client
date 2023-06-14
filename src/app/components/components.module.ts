import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TarjetaListaComponent } from './tarjeta-lista/tarjeta-lista.component';
import { PastillaEstadoComponent } from './pastilla-estado/pastilla-estado.component';
import { BotonRegresarComponent } from './boton-regresar/boton-regresar.component';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  declarations: [
    ModalComponent,
    TarjetaListaComponent,
    PastillaEstadoComponent,
    BotonRegresarComponent,
    AvatarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    TarjetaListaComponent,
    PastillaEstadoComponent,
    BotonRegresarComponent,
    AvatarComponent
  ]
})
export class ComponentsModule { }
