import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { MonedaPipe } from './moneda.pipe';
import { RolPipe } from './rol.pipe';
import { FiltroUsuariosPipe } from './filtro-usuarios.pipe';
import { FiltroClientesPipe } from './filtro-clientes.pipe';
import { CodigoMaderaPipe } from './codigo-madera.pipe';
import { FiltroPlacasMaderaPipe } from './filtro-placas-madera.pipe';



@NgModule({
  declarations: [
    FechaPipe,
    MonedaPipe,
    RolPipe,
    FiltroUsuariosPipe,
    FiltroClientesPipe,
    CodigoMaderaPipe,
    FiltroPlacasMaderaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    MonedaPipe,
    RolPipe,
    FiltroUsuariosPipe,
    FiltroClientesPipe,
    CodigoMaderaPipe,
    FiltroPlacasMaderaPipe
  ]
})
export class PipesModule { }
